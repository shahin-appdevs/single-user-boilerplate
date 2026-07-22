# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## This is NOT the Next.js you know

Next.js **16** with breaking changes from prior versions. APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next-specific code. Heed deprecation notices.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (uses `--webpack`; project is **static export**, `output: "export"`)
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npm run preview` — build + run on Cloudflare runtime locally (opennextjs-cloudflare)
- `npm run deploy` / `npm run upload` — build + ship to Cloudflare Workers
- `npm run clean:dev` — wipe `.next`/`.open-next`/`.wrangler`/`out` then dev
- `npm run cf-typegen` — regenerate `cloudflare-env.d.ts` from wrangler bindings

No test runner is configured. Typecheck via `npx tsc --noEmit`.

## Big-picture architecture

Mobile-first fintech (QRPay Pro). Next.js 16 App Router + TypeScript, Tailwind v4, shadcn/ui, deployed as a **static export** to Cloudflare via OpenNext. Static export means no server runtime — all auth/data is client-side (`"use client"` + TanStack Query against an external API).

### Routing & i18n

- All routes live under `src/app/[locale]/`. Locales are `["en", "ar"]` with `localePrefix: "always"` (`src/i18n/routing.ts`) — every URL is prefixed `/en/...` or `/ar/...`.
- Three route groups: **(app)** (private dashboard, gated by `AuthGuard`), **(auth)** (login/register), **(public)** (marketing/docs/legal).
- next-intl is wired via `src/i18n/request.ts` (`getRequestConfig`, timezone hardcoded `Asia/Dhaka`). Messages are nested JSON in `src/i18n/messages/{en,ar}.json`. Use `useTranslations()` (client) / `getTranslations()` (server). Navigation helpers (locale-aware `Link`, `useRouter`) come from `src/i18n/navigation.ts` — use these, not raw `next/navigation`.
- Arabic flips layout via HTML `dir="rtl"`. Use **logical** Tailwind utilities (`ms-/me-/ps-/pe-/start-/end-`), never physical (`ml-/mr-/left-/right-/text-left`).

### Auth (client-side, multi-layer)

`src/store/authStore.ts` (Zustand) is the single source of truth: `status` (`unknown` → `authenticated` | `unauthenticated`), `user`, `token`, `role`, `intendedPath`.

Flow:
1. `AuthBootstrapper` (`src/providers/`) runs on init → reads token from storage, fetches `me()` if needed.
2. `AuthGuard` wraps `(app)` routes → skeleton while `status === "unknown"`, redirects to login if unauthenticated.
3. **401 bridge** (pub/sub): axios response interceptor catches 401 → `clearToken()` + emits `"unauthorized"` event (`src/lib/api/auth-events.ts`). `AuthEventsBridge` (mounted inside `QueryProvider`) listens → logs out, clears Query cache, toasts, redirects. `claimUnauthorizedHandling()` collapses concurrent 401s into one logout within a 2s window.
4. `IdleTimerProvider` — 5min idle / 60s warning → `IdleWarningDialog` countdown → auto-logout.

Token storage (`src/lib/auth/token.ts`): `remember=true` → localStorage else sessionStorage; keys `mfs.jwt` / `mfs.remember`; expiry checked with a 30s skew buffer.

### API layer

`src/lib/api/` — axios instance (`axios.ts`), base URL from `NEXT_PUBLIC_API_URL`. Import from the barrel `@/lib/api`: `apiClient` (raw axios), `apiRequest<T>()` (standard), `apiUpload<T>()` (multipart). Request interceptor adds `Authorization: Bearer` unless `skipAuth`. `error.ts` normalizes `AxiosError` → `ApiError` `{status, message, code, fields, traceId, isNetwork, isAuth}` and **scrubs PIN fields**. Endpoints are centralized in `src/constants/api-endpoints.ts`.

### State & data

- TanStack Query (`src/providers/QueryProvider.tsx`): singleton client, `staleTime 30s`, `gcTime 5m`; retry skips 401/404/422, mutations never retry.
- Zustand stores in `src/store/`: `authStore` (above); `themeStore` (persists backend-supplied HSL color triplets to `:root` CSS vars, key `mfs-backend-theme`).
- Provider tree (`src/app/[locale]/layout.tsx`): `NextIntlClientProvider` → `ThemeProvider` (next-themes, `attribute="class"`) → `QueryProvider` → `AuthBootstrapper` + `IdleTimerProvider` + `Toaster` + `AuthEventsBridge`.

### Components

- `components/ui/` — shadcn primitives (style `radix-nova`, baseColor neutral, lucide icons; see `components.json`). Do not hand-edit generated files; re-add via shadcn CLI.
- `components/shared/` — cross-cutting (Header, Footer, LocaleSwitcher, ThemeToggle, AuthShell, IdleWarningDialog).
- `components/features/<domain>/` — domain UI (auth, home, wallet, transaction, …).
- `components/primitives/` — custom atoms (e.g. `PinInput`, `OtpInput`).

### Styling & theming

Tailwind v4, no `tailwind.config.js` — everything in `src/app/globals.css` via `@theme`. Colors are **HSL channel triplets** (`227 100% 61%`) so the backend can override them at `:root` at runtime; always consume via `hsl(var(--token))`. Dark mode = `.dark` class on `<html>` (next-themes). Bespoke tokens: `--grad-from/to`, `--gradient`, `--surface`, `--surface-2`, `--hairline`, `--hairline-strong`, `--glow`; `.glass` component utility.

### Validation

Zod schemas in `src/lib/validators/` (e.g. `auth.ts`: country-specific phone, 18+ age, file ≤5MB JPG/PNG/PDF), used with React Hook Form via `@hookform/resolvers`.

## Conventions

- **Always use Tailwind v4 classes** — utility-first, no inline `style` or separate CSS for what a utility covers. Tokens via `@theme` in `globals.css`, no `tailwind.config.js`.
- Named exports, sentence case, minimal comments.
- Active task specs live in `tasks/` (e.g. `tasks/dashboard.md` — the in-progress user dashboard build).
