# Mobile Financial Services Platform — Project Plan

> Complete development plan, decisions, and reference document.
> Keep this file in sync with the actual codebase.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Rendering Strategy](#4-rendering-strategy)
5. [Folder Structure](#5-folder-structure)
6. [Security Requirements](#6-security-requirements)
7. [Cache Strategy](#7-cache-strategy)
8. [Authentication Flow](#8-authentication-flow)
9. [Theme System](#9-theme-system)
10. [Internationalization](#10-internationalization)
11. [Core Components](#11-core-components)
12. [Cloudflare Deployment](#12-cloudflare-deployment)
13. [Build Order](#13-build-order)
14. [Critical Gotchas](#14-critical-gotchas)
15. [Performance Checklist](#15-performance-checklist)
16. [Claude AI Usage Tips](#16-claude-ai-usage-tips)

---

## 1. Project Overview

**Type:** Mobile-first Financial Services Platform (Fintech)

**Core Features:**
- QR-based money transfer (scan + generate)
- Bill payment
- Mobile wallet (send, receive, balance)
- Virtual card
- International remittance
- Mobile top-up
- Real-time transaction statements
- Multi-language (English, Arabic)

**Platforms:**
- Web (this Next.js app)
- Mobile app (Flutter — shares same Laravel API)

**Backend:** Laravel REST API (external, already exists)

---

## 2. Tech Stack

| Layer | Choice | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | RSC, SSR, routing |
| Language | TypeScript | Type safety |
| Deploy | Cloudflare Workers via `@opennextjs/cloudflare` | Edge performance |
| Client State | Zustand | Auth, theme, session |
| Server State | TanStack Query | All API data fetching |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| UI Kit | shadcn/ui | Accessible components |
| Icons | lucide-react | Tree-shakable icons |
| Animation | Framer Motion | Minimal, selective use |
| Forms | React Hook Form + Zod | Type-safe validation |
| Toasts | Sonner | Notifications |
| i18n | next-intl | Translation, routing |
| Dark Mode | next-themes | System + manual toggle |
| HTTP | Axios | Request/response interceptors |
| Dates | date-fns | With per-locale support (en, ar) |
| QR Generate | qrcode | Payment QR generation |
| QR Scan | html5-qrcode | Camera-based scanning |
| Charts | Recharts | Statement visualization |

---

## 3. Architecture Decisions

### Core Decisions

| Decision | Choice | Reason |
|---|---|---|
| Rendering for public pages | SSR + Cache API | Free, fast, no R2 needed |
| Rendering for app pages | CSR only | User-specific, security |
| Server cache storage | Cloudflare Cache API (`caches.default`) | Free, no R2/KV cost |
| Cache invalidation | TTL-based only (no purge system) | Simpler, fits content type |
| Auth token storage | localStorage / sessionStorage | Flutter compatibility |
| Token model | Single JWT (no refresh token) | Backend issues one JWT only |
| Token expiry handling | On 401 / expired JWT → clear + redirect to login | No refresh endpoint exists |
| Idle timeout (client) | 5 minutes inactivity → force logout | Fintech standard |
| JWT TTL (server) | Set by Laravel backend | Re-login when expired |
| Real-time updates | Polling via TanStack Query `refetchInterval` | Free, simple (Phase 1) |
| Amount handling | Integer (paisa) on backend | Float precision safety |

### Why These Choices

- **Cache API over R2:** R2 needs credit card. Cache API is completely free, server-side, and globally distributed.
- **CSR for app pages:** Sensitive financial data must never be cached. Token in localStorage can't be accessed in Server Components anyway.
- **JWT in localStorage:** Required for Flutter mobile app to share auth state via shared storage. CSP and XSS protection compensate for the risk.
- **No purge system:** Public marketing/info content doesn't change frequently. TTL expiry is acceptable.

---

## 4. Rendering Strategy

### Public Pages (SSR + Edge Cache)

| Page | Strategy | TTL |
|---|---|---|
| Homepage (landing) | SSR + cache | 1 hour |
| Features (QR, wallet, etc.) | SSG | Build time |
| How it works | SSG | Build time |
| Fees & charges | SSR + cache | 1 hour |
| Security info | SSG | Build time |
| About, contact | SSG | Build time |
| FAQ | SSR + cache | 1 hour |
| Blog (if any) | SSR + cache | 1 hour |
| Download app | SSG | Build time |
| Terms, privacy | SSG | Build time |

### Authenticated Pages (CSR Only)

| Page | Strategy |
|---|---|
| Dashboard | CSR + refetchInterval |
| Wallet | CSR + real-time |
| Send money (QR) | CSR |
| Receive money | CSR |
| Bill payment | CSR |
| Mobile top-up | CSR |
| Virtual card | CSR |
| Remittance | CSR |
| Statement | CSR + filters |
| Profile / Settings | CSR |
| Security settings | CSR |
| KYC | CSR |
| Notifications | CSR + polling |

**Rule:** If it's personalized or sensitive, CSR. If it's public marketing, SSR + cache.

---

## 5. Folder Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (public)/                # Marketing/info pages
│   │   │   ├── page.tsx             # Landing
│   │   │   ├── features/
│   │   │   ├── fees/
│   │   │   ├── security/
│   │   │   ├── faq/
│   │   │   └── layout.tsx
│   │   ├── (auth)/                  # Login flow
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-otp/
│   │   │   ├── forgot-pin/
│   │   │   └── layout.tsx
│   │   ├── (app)/                   # Authenticated app
│   │   │   ├── dashboard/
│   │   │   ├── wallet/
│   │   │   ├── send/
│   │   │   │   ├── qr/
│   │   │   │   ├── contact/
│   │   │   │   └── bank/
│   │   │   ├── receive/
│   │   │   ├── bills/
│   │   │   ├── topup/
│   │   │   ├── card/
│   │   │   ├── remittance/
│   │   │   ├── statement/
│   │   │   ├── profile/
│   │   │   ├── security/
│   │   │   ├── kyc/
│   │   │   ├── notifications/
│   │   │   └── layout.tsx           # AuthGuard + IdleTimer
│   │   └── layout.tsx               # Root providers
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn components
│   ├── shared/                      # Header, Footer, BottomNav
│   ├── features/                    # Domain components
│   │   ├── auth/
│   │   ├── wallet/
│   │   ├── transfer/
│   │   ├── transaction/
│   │   └── security/
│   └── primitives/                  # AmountInput, PinInput, OtpInput
├── lib/
│   ├── api/
│   │   ├── axios.ts                 # JWT bearer + 401→logout interceptor
│   │   └── error.ts                 # Error handling
│   ├── cache/
│   │   ├── types.ts                 # CacheAdapter interface
│   │   ├── cloudflare.ts            # Cache API implementation
│   │   ├── memory.ts                # Dev/fallback
│   │   └── index.ts                 # withCache wrapper
│   ├── auth/
│   │   ├── token.ts                 # JWT storage + expiry-decode helpers
│   │   └── session.ts               # Idle timer
│   ├── security/
│   │   ├── csp.ts
│   │   └── fingerprint.ts
│   ├── theme.ts                     # Backend color merge
│   ├── format/
│   │   ├── currency.ts
│   │   ├── date.ts
│   │   └── number.ts
│   └── validators/                  # Zod schemas
├── hooks/
│   ├── useAuth.ts
│   ├── useIdleTimer.ts
│   ├── useBalance.ts
│   ├── useTransactions.ts
│   └── [feature-hooks].ts
├── store/
│   ├── authStore.ts
│   ├── themeStore.ts
│   └── sessionStore.ts
├── services/
│   ├── authService.ts
│   ├── walletService.ts
│   ├── transferService.ts
│   ├── transactionService.ts
│   └── ...
├── providers/
│   ├── QueryProvider.tsx
│   ├── ThemeProvider.tsx
│   ├── AuthGuard.tsx
│   └── IdleTimerProvider.tsx
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── messages/
│       ├── en.json
│       └── ar.json
├── types/
├── constants/
│   ├── routes.ts
│   ├── api-endpoints.ts
│   └── transaction-types.ts
└── middleware.ts                    # i18n + auth redirect
```

---

## 6. Security Requirements

Fintech is highest security priority. Non-negotiable requirements:

> **Two independent timers.** Idle timeout (5 min, client-side) logs out an inactive user. JWT TTL (server-side, set by Laravel) caps how long a leaked token works. No refresh token — when JWT expires, user re-logs in.

### Token Security
- Single JWT issued by backend on login (no refresh token)
- JWT TTL set server-side (Laravel) — keep short for fintech
- Auto-logout on JWT expiry or any 401
- No refresh/rotation logic (backend provides none)
- Validate JWT presence on app load; expired/malformed → clear + redirect

### Session Management
- 5 minutes idle timeout
- Warning modal at 4 minutes
- Activity tracker on: mousemove, keydown, touchstart, click
- Clear all storage on logout

### Operational Security
- PIN/OTP confirmation for: transfer, payment, withdraw, large amounts
- Unique transaction reference for every operation
- No optimistic updates for money operations
- Idempotency keys for transaction API calls
- Device fingerprint sent on login

### Input/Output Security
- Strict Content Security Policy (CSP)
- No `dangerouslySetInnerHTML` anywhere
- All user input sanitized (server-side primary)
- PIN never logged, never in error messages
- Amount in integer (paisa), never float
- No sensitive data in URL parameters

### Headers (set in `next.config.ts`)
```typescript
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), microphone=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}
```

---

## 7. Cache Strategy

### Where to Cache

**Server cache (Cloudflare Cache API):** Only public marketing pages.

**Client cache (TanStack Query):** All authenticated pages, all interactive data.

**Never cache:**
- User balance, transactions
- Profile, settings
- Anything authenticated

### Cache Layer Architecture (Portable)

```
lib/cache/
├── types.ts        # CacheAdapter interface
├── cloudflare.ts   # Production
├── memory.ts       # Development/fallback
└── index.ts        # withCache wrapper
```

### Cache Key Convention

Format: `{locale}:{resource}:{type}:{identifier}`

Examples:
- `en:homepage:hero`
- `ar:fees:table`
- `en:faq:list`
- `en:blog:post:why-mobile-banking`

### TTL Recommendations

| Content Type | TTL |
|---|---|
| Marketing landing content | 1 hour |
| Fees & charges | 1 hour |
| FAQ | 1 hour |
| Blog posts | 1 hour |
| Static (about, terms) | Build-time SSG |
| Search results (if any) | 5 minutes |

### No Purge System (Decision)

We chose TTL-only expiry. Content updates wait max 1 hour to propagate. For our content type (marketing/info), this is acceptable.

If we ever need purge later, add `lib/purge.ts` + webhook endpoint without disturbing existing code.

---

## 8. Authentication Flow

### Storage Strategy

- **JWT:** localStorage (or sessionStorage if "remember me" off)
- **No refresh token** — backend issues a single JWT only
- **Why localStorage:** Required for Flutter app to share auth state via WebView or platform channels
- **Risk mitigation:** Strict CSP, XSS prevention, short JWT TTL

### Login Flow

```
1. User submits credentials
2. POST /auth/login → returns { token, user }
3. Store JWT (local or session based on "remember me")
4. Update Zustand auth store
5. Redirect to /dashboard
```

### Request Flow

```
1. Axios interceptor adds Authorization: Bearer {jwt}
2. API responds
3. If 401 (expired/invalid JWT):
   a. Clear JWT from storage
   b. Reset Zustand auth store + clear TanStack Query cache
   c. Redirect to /login (preserve intended path for post-login return)
4. No refresh attempt — single JWT, re-login required
```

### Idle Timeout Flow

```
1. Track user activity (mousemove, keydown, touchstart, click)
2. Reset 5-minute timer on any activity
3. At 4 minutes, show warning modal: "Session expiring in 1 minute"
4. User clicks "Stay" → reset timer
5. User clicks "Logout" or 5 minutes hit → clear tokens, redirect
```

### Logout Flow

```
1. Call POST /auth/logout (optional, for backend revocation)
2. Clear localStorage / sessionStorage tokens
3. Reset Zustand auth store
4. Clear TanStack Query cache (sensitive data)
5. Redirect to /login
```

---

## 9. Theme System

### Strategy

CSS variables in HSL format, defined in `globals.css` with light/dark variants. Backend can override at runtime via JS-injected inline styles on `:root`.

### Fallback Colors (globals.css)

```css
@layer base {
  :root {
    --primary: 222 47% 11%;
    --primary-foreground: 210 40% 98%;
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    /* ... all shadcn variables */
  }
  .dark {
    --primary: 210 40% 98%;
    --primary-foreground: 222 47% 11%;
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
  }
}
```

### Backend Color Override

Backend sends colors in HSL format: `"222 47% 11%"` (not hex).

If backend sends hex, convert client-side via `lib/theme.ts` utility.

Same Tailwind class works for both light/dark and for backend overrides:
```tsx
<button className="bg-primary text-primary-foreground">Send</button>
```

### Dark Mode Toggle

Use `next-themes` package, `attribute="class"` strategy. Tailwind v4 `dark:` not needed since same class adapts via CSS variables.

---

## 10. Internationalization

### Languages
- English (en) — default
- Arabic (ar) — RTL

**Roadmap (add later):** Spanish (es), Hindi (hi), French (fr). Build i18n config to scale — locales as array, no hardcoded `en`/`ar` branching.

### Library: next-intl

### URL Structure
- `/en/dashboard`
- `/ar/dashboard`

### Files
- `i18n/routing.ts` — locales, defaultLocale, pathnames
- `i18n/request.ts` — server config
- `i18n/messages/en.json`, `i18n/messages/ar.json`
- `middleware.ts` — locale detection + redirect

### Key Conventions
- Flat key structure: `auth.login.title` (not deeply nested)
- Namespace by feature
- Currency: `Intl.NumberFormat` per locale
- Dates: `date-fns` — import locale dynamically per active locale (`en-US`, `ar`)
- RTL: Arabic sets `dir="rtl"` on `<html>`. Use Tailwind logical properties (`ms-`/`me-`/`ps-`/`pe-`) not `ml-`/`mr-`. Mirror directional icons.

### Locale-Specific Formatting

```typescript
// English (en): "$1,250.50"
// Arabic  (ar): "١٬٢٥٠٫٥٠ $"   // Intl.NumberFormat handles digits + RTL
const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
```

### RTL Layout

Arabic is RTL. es/hi/fr (planned) are LTR. Direction is locale-driven, never hardcoded.

#### Direction Source of Truth

Set `dir` on `<html>` from the active locale in the root layout — single source, no per-component logic.

```tsx
// app/[locale]/layout.tsx
const RTL_LOCALES = ['ar'];                 // extend as RTL langs added
const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';

return (
  <html lang={locale} dir={dir}>
    <body>{children}</body>
  </html>
);
```

#### Tailwind Rules (logical, not physical)

| Use | Not |
|---|---|
| `ms-*` / `me-*` (margin start/end) | `ml-*` / `mr-*` |
| `ps-*` / `pe-*` (padding start/end) | `pl-*` / `pr-*` |
| `start-*` / `end-*` (inset) | `left-*` / `right-*` |
| `text-start` / `text-end` | `text-left` / `text-right` |
| `rounded-s-*` / `rounded-e-*` | `rounded-l-*` / `rounded-r-*` |
| `border-s-*` / `border-e-*` | `border-l-*` / `border-r-*` |

Tailwind v4 maps these to CSS logical properties — they auto-flip with `dir`. Physical utils only when something must NOT flip (e.g. a logo locked left).

#### Icons & Directional UI

- Mirror directional icons in RTL: back/forward arrows, chevrons, send, progress steppers.
  ```tsx
  <ArrowLeft className="rtl:rotate-180" />   // or pick icon by dir
  ```
- Do NOT mirror: brand logos, media play ▶, clocks, checkmarks, phone numbers, latin/number-only fields.
- Bottom nav order stays visual; let flexbox + `dir` reverse it — don't manually reorder.

#### Components Needing RTL Care

| Area | Watch for |
|---|---|
| `AmountInput` | Amount + currency symbol side; keep digits LTR within RTL flow (`dir="ltr"` on the input, container RTL) |
| `PinInput` / `OtpInput` | Box fill order, auto-tab direction must follow `dir` |
| `QrScanner` | Camera frame + overlay alignment |
| `TxnList` | Row layout: label start, amount end — uses logical props |
| `StatementChart` | Recharts axis/legend orientation; set chart `dir` explicitly |
| Sidebar / drawers | Slide-in from start edge, not hardcoded left |
| Toasts (Sonner) | Position flips (`top-right` → `top-left` feel); set per dir |
| Modals / Sheet | Close button on end edge |

#### Phone & Number Fields

Phone, PIN, OTP, account numbers stay **LTR even in RTL** layout. Wrap input with `dir="ltr"` so digits + `+` prefix render left-to-right inside the RTL page.

#### Testing RTL

- [ ] Toggle `ar` → whole app mirrors, no clipped/overlapping elements
- [ ] No physical `ml-/mr-/left-/right-` leaked (grep before merge)
- [ ] Directional icons mirrored; logos/media not
- [ ] Number/phone fields stay LTR
- [ ] Charts, scanner, OTP boxes behave under RTL
- [ ] Scrollbars, focus order, swipe gestures correct direction

---

## 11. Core Components

### Primitives (`components/primitives/`)

| Component | Purpose | Key Features |
|---|---|---|
| `AmountInput` | Currency input | Thousand separator, min/max, decimal handling |
| `PinInput` | Secure PIN entry | Masked, no paste, auto-tab |
| `OtpInput` | OTP verification | 4-6 digit, auto-submit, resend timer |

Use shadcn `input-otp` as base for PIN and OTP.

### Feature Components (`components/features/`)

| Component | Purpose |
|---|---|
| `auth/LoginForm` | Phone + PIN login |
| `auth/OtpVerification` | OTP confirmation step |
| `auth/PinPad` | On-screen PIN keypad |
| `wallet/BalanceCard` | Show/hide balance, refresh |
| `wallet/QuickActions` | Send, receive, bills, top-up shortcuts |
| `transfer/QrScanner` | Camera-based QR scanning |
| `transfer/QrGenerator` | Generate payment QR |
| `transfer/TransferForm` | Amount + recipient + note |
| `transfer/ConfirmModal` | Final PIN confirmation |
| `transaction/TxnList` | Infinite scroll list |
| `transaction/TxnDetail` | Full transaction info modal |
| `transaction/StatementChart` | Recharts visualization |
| `security/PinChange` | Change PIN flow |
| `security/TwoFactor` | 2FA setup |

### Shared Components (`components/shared/`)

| Component | Purpose |
|---|---|
| `Header` | Top navigation |
| `Footer` | Public pages footer |
| `Sidebar` | App pages side nav (desktop) |
| `BottomNav` | App pages bottom nav (mobile) |
| `IdleWarningDialog` | Session timeout warning |
| `LoadingSkeleton` | Skeleton placeholders |
| `ErrorBoundary` | Error fallback UI |

### UI States (loading / empty / error)

Every data-driven view resolves to one of four states. Pick exactly one — never blank screen, never spinner over stale money data.

| State | When | UI |
|---|---|---|
| **Loading** | First fetch, no cached data | Skeleton matching final layout (not a spinner) |
| **Empty** | Fetch ok, zero rows | Illustration + message + primary action |
| **Error** | Fetch failed | Inline error card + Retry button |
| **Success** | Data present | The real content |

Background refetch (data already shown) → keep content, show subtle indicator (top bar / dim), never skeleton-flash.

#### Skeleton Component Contract

One skeleton per layout shape, co-located with its feature. Skeleton mirrors the success layout's box sizes so no shift on load.

```tsx
// Contract: skeleton takes count, renders layout-matching placeholders
<TxnListSkeleton rows={6} />
<BalanceCardSkeleton />
<StatementChartSkeleton />
```

Rules:
- Match real component dimensions (height, spacing) → zero CLS.
- Animate with one shared `animate-pulse` util, not per-skeleton.
- Respect `prefers-reduced-motion` → static skeleton, no pulse.
- Never show skeleton when cached data exists (TanStack `isLoading` not `isFetching`).

#### Standard State Wrapper

Wrap query-driven views in one helper so behavior is uniform:

```tsx
<QueryState
  query={txnQuery}
  skeleton={<TxnListSkeleton rows={6} />}
  empty={<EmptyState icon={Receipt} title="No transactions yet" />}
  error={(err, retry) => <ErrorState error={err} onRetry={retry} />}
>
  {(data) => <TxnList items={data} />}
</QueryState>
```

`QueryState` maps TanStack states: `isLoading`→skeleton, `isError`→error+retry, empty array→empty, else children.

#### Empty State Pattern

`components/shared/EmptyState` — `{ icon, title, description?, action? }`. Per view: no transactions, no notifications, no search results, empty wallet, no cards. Always offer the next action (e.g. "Send money").

#### Error Boundary Scope

Layered, not one global catch:

| Scope | Catches | Fallback |
|---|---|---|
| Root (`app/[locale]/layout`) | App-fatal render crash | Full-page error + reload |
| App segment (`(app)/layout`) | Authed-area crash | In-shell error, nav intact |
| Per-feature `ErrorBoundary` | Widget render crash (e.g. chart) | Card-level fallback, rest of page lives |
| Async/query errors | Fetch failures | `QueryState` error UI (NOT boundary — boundaries don't catch async) |

- Use Next.js `error.tsx` per route segment for render errors.
- Query/mutation errors handled by `QueryState` + Sonner toast — never bubble to boundary.
- **Money mutations:** on error never assume failure — show "Verifying…" and poll status (gotcha 17). Error state must say "couldn't confirm", not "failed".
- Log boundary catches to monitoring (Sentry, later phase). Never show raw stack to user.

#### Loading on Mutations (buttons/forms)

- Disable submit + show inline spinner on button during mutation.
- Block double-submit (idempotency key + disabled state).
- PIN/OTP confirm modals: loading on confirm, not page-level.

---

## 12. Cloudflare Deployment

### Setup Steps

```bash
npm install --save-dev @opennextjs/cloudflare wrangler @cloudflare/workers-types
```

### `open-next.config.ts`

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

### `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "mobile-finance-app",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-09-23",
  "compatibility_flags": [
    "nodejs_compat",
    "global_fetch_strictly_public"
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS",
    "run_worker_first": true
  },
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "vars": {
    "NEXT_PUBLIC_API_URL": "https://api.yoursite.com"
  }
}
```

### Secrets (set via CLI)

```bash
npx wrangler secret put API_URL
npx wrangler secret put WEBHOOK_SECRET   # if added later
```

### `next.config.ts`

```typescript
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    reactCompiler: true,
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(self), microphone=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    }];
  },
};

export default nextConfig;
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types"
  }
}
```

### Deploy

```bash
npm run deploy
```

### Important Notes
- Cloudflare WAF should be enabled (free tier available)
- DNS proxy (orange cloud) must be ON for caching
- Environment variables via `wrangler secret put` for sensitive values
- `compatibility_date` must be recent enough for Next.js 16

---

## 13. Build Order

### Foundation Phase (Day 1-10)

| Day | Task |
|---|---|
| 1 | Next.js 16 init, Tailwind, shadcn, folder structure |
| 2 | Theme system (light/dark + backend color override) |
| 3 | i18n setup (en, ar messages, RTL, middleware, scalable routing) |
| 4 | Axios + JWT bearer + 401→logout interceptor |
| 5 | Auth store, token storage helpers, idle timer hook |
| 6 | Login + OTP + Register flow (UI only, mock API) |
| 7 | AuthGuard, app layout, bottom navigation |
| 8 | Reusable primitives (AmountInput, PinInput, OtpInput) |
| 9 | Public marketing pages (SSR + cache layer) |
| 10 | Cloudflare deploy + smoke test |

### Feature Phase (Day 11-22)

| Day | Task |
|---|---|
| 11 | Dashboard (balance card, quick actions, recent txns) |
| 12 | Wallet page |
| 13 | Send money flow (QR scan + amount + PIN + confirm) |
| 14 | QR generator (receive money) |
| 15 | Bill payment + categories |
| 16 | Mobile top-up |
| 17 | Virtual card |
| 18 | Remittance flow |
| 19 | Transaction statement + filters + chart |
| 20 | Profile, security settings (PIN change, 2FA) |
| 21 | KYC flow with document upload |
| 22 | Notifications |

### Polish Phase (Day 23-30)

| Day | Task |
|---|---|
| 23-25 | Polish, error states, loading states, empty states |
| 26-28 | Testing, edge cases, security audit |
| 29-30 | Production deploy, monitoring, documentation |

---

## 14. Critical Gotchas

### Next.js 16 Specific
1. `params` is now a Promise — use `const { slug } = await params`
2. `cookies()`, `headers()` are async — use `await`
3. Turbopack is stable — use `--turbo` flag

### Cloudflare Workers
4. `caches.default` only exists at runtime — type guard before use
5. `nodejs_compat` flag required for many npm packages
6. Some heavy packages (puppeteer, sharp) won't work even with compat
7. `compatibility_date` must be recent for Next.js 16

### Auth & Security
8. Server Components can't access `localStorage` — auth code must be `"use client"`
9. Any 401 → immediate logout (no refresh); guard against multiple redirect calls firing from concurrent 401s
10. Never log PIN, even in dev console
11. Token leak via XSS is real risk — strict CSP is essential
12. Idempotency keys for transactions to prevent double-submit

### Money Handling
13. Always integer (paisa/cents) on backend, never float
14. No optimistic updates for money operations
15. Show transaction reference immediately for user to screenshot
16. After transfer success, replace history (prevent back button double-submit)
17. Network failure during transaction — poll to verify, don't assume

### UI/UX
18. Camera permission denial — provide manual entry fallback
19. Phone formats (`+880` prefix, 11 digits) — strict Zod validation
20. Arabic-Indic numerals (`١٬٢٥٠`) render via `Intl.NumberFormat` with `ar` locale — don't hardcode digit maps
21. Mobile-first — most users on phone, design accordingly
22. Bottom navigation for app pages (thumb reach)

### i18n
23. Locale must be in cache keys (`en:homepage:hero` vs `ar:homepage:hero`)
24. `next-intl` middleware must run before other middleware logic
25. Translation key flat structure (`auth.login.title`) not deeply nested

### Backend Integration
26. Laravel error format: `{ message, errors: { field: [msgs] } }`
27. Backend color in HSL format (`"222 47% 11%"`) not hex
28. Backend webhook for cache purge — add later if needed, not in v1

---

## 15. Performance Checklist

### Build-time
- [ ] Code splitting per route (automatic in App Router)
- [ ] Heavy libs dynamic import (QR scanner, charts)
- [ ] Lucide icons named import only: `import { Home } from 'lucide-react'`
- [ ] Bundle analyzer: `ANALYZE=true npm run build`

### Runtime
- [ ] `next/image` for all images
- [ ] `next/font/google` self-hosted (no render blocking)
- [ ] Public pages `runtime = 'edge'` for fast cold start
- [ ] Skeleton screens for all data fetch
- [ ] TanStack Query `staleTime` set appropriately

### Caching
- [ ] Public pages SSR + Cache API
- [ ] Auth pages CSR with TanStack Query
- [ ] Cache TTL set per content type
- [ ] TanStack Query `refetchInterval` for real-time data

### Network
- [ ] Cloudflare DNS proxy (orange cloud) enabled
- [ ] WAF enabled for security
- [ ] HSTS header
- [ ] HTTP/3 enabled in Cloudflare

### Mobile
- [ ] Mobile-first responsive design
- [ ] Bottom navigation for thumb reach
- [ ] Tap targets minimum 44x44px
- [ ] No hover-only interactions

---

## 16. Claude AI Usage Tips

### Save Tokens

1. **Use Claude Project Instructions** — paste short stack summary once, don't repeat per chat
2. **Send specific context only** — relevant function/interface, not entire files
3. **Reusable prompt templates** — "In our standard pattern, create X feature"
4. **Code-only mode** — say "code only, no explanation" when not needed
5. **Small focused tasks** — one component per prompt, not entire features
6. **Don't ask Claude for shadcn components** — install via CLI

### Effective Prompts

**Good:**
> "Create a `useTransfer` hook following our service+hook pattern. It mutates `transferService.send` with PIN confirmation. On success show Sonner toast and invalidate balance query."

**Bad:**
> "Create transfer functionality" (too vague, will waste tokens)

### When Stuck

- Don't paste error stack traces immediately — try fixing typos first
- Search the error online first (5 min) before asking
- Specific error + relevant code snippet = best Claude response
- Use separate chat for debugging (don't pollute main project context)

### Project Instructions to Paste

```
Project: Mobile Financial Services Platform (Fintech)
Features: QR money transfer, payments, mobile wallet, virtual card, 
remittance, top-up, real-time statements.

Stack: Next.js 16 App Router, TypeScript, Zustand, TanStack Query,
Tailwind v4, shadcn/ui, lucide-react, RHF + Zod, Sonner, next-intl,
Framer Motion (minimal). Deploy: Cloudflare Workers via @opennextjs/cloudflare.

Architecture:
- Public marketing pages: SSR + Cache API (via lib/cache wrapper)
- Authenticated app pages: CSR only, no server cache
- Auth: JWT token in local/sessionStorage (Flutter compatible)
- Backend: Laravel API
- 5-min idle session timeout

Security: PIN/OTP for sensitive ops, strict CSP, no localStorage 
logging, amount in integer (paisa), no optimistic update for money.

Patterns:
- services/ for API calls
- hooks/ wrapping TanStack Query  
- features/ for domain components
- primitives/ for AmountInput, PinInput, OtpInput

Always TypeScript, sentence case, minimal comments, named exports.
Currency display: Intl.NumberFormat per locale. Dates: date-fns with
per-locale import. Locales: en (default), ar (RTL); es/hi/fr planned.

When generating code: assume Laravel returns standard JSON, JWT in 
Authorization header, errors as {message, errors: {field: [msg]}}.
```

---

## Appendix A: Environment Variables

### Required

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Wrangler vars | Laravel API base URL |
| `API_URL` | Wrangler secret | Internal API URL (server-side) |

### Optional (for later phases)

| Variable | Purpose |
|---|---|
| `WEBHOOK_SECRET` | Laravel → Next.js webhook auth |
| `CF_ZONE_ID` | Cloudflare zone for cache purge |
| `CF_API_TOKEN` | Cloudflare API token |
| `SENTRY_DSN` | Error monitoring |

---

## Appendix B: Common Commands

```bash
# Development
npm run dev

# Add shadcn component
npx shadcn@latest add [component-name]

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview Cloudflare build locally
npm run preview

# Deploy to Cloudflare
npm run deploy

# Set secret
npx wrangler secret put VARIABLE_NAME

# Tail production logs
npx wrangler tail
```

---

## Appendix C: Decision Log

| Date | Decision | Reason |
|---|---|---|
| Initial | Use Cloudflare Workers over Vercel | Free tier generous, edge performance, no commercial use restriction |
| Initial | Use Cache API over R2 | Free, no credit card needed |
| Initial | No cache purge system (v1) | Content type doesn't require it; TTL is enough |
| Initial | JWT in localStorage (not httpOnly cookie) | Flutter app sharing |
| Initial | Single JWT, no refresh token | Backend issues one JWT only; on expiry/401 re-login |
| Initial | Polling over WebSocket (v1) | Simpler, no extra service |
| Initial | Integer (paisa) for amounts | Float precision issues |
| Initial | 5-min idle timeout | Fintech industry standard |
| Initial | CSR for all authenticated pages | Sensitive data, security |

---

## Notes & Updates

> Add notes here as the project evolves.

- **Created:** Project planning phase
- **Last updated:** [Update as needed]

---

**End of Plan**