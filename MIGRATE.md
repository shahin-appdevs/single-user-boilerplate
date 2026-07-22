# Migration: Cloudflare Workers (SSR) → Static Export (Cloudflare Pages)

This documents the move from the **previous** setup — server-side rendered on Cloudflare Workers via `@opennextjs/cloudflare` — to the **current** setup: a fully static site (`output: "export"`) served from Cloudflare Pages.

---

## Why migrate

| | Previous (Workers / opennext) | Current (Static export / Pages) |
|---|---|---|
| Rendering | SSR on demand (Node/Workers runtime) | Pre-rendered static HTML at build |
| Output | `.open-next` / Worker bundle | `out/` folder |
| Hosting | Cloudflare Workers | Cloudflare Pages (static CDN) |
| Middleware | Runs (locale detection) | **Not supported** |
| `next/image` | Optimized | `unoptimized` |
| API routes / server actions | Supported | **Not supported** |

Trade for simplicity + CDN speed: you lose SSR, middleware, and runtime image optimization.

---

## What changed (this migration)

### 1. `next.config.ts`
Added static-export options:
- `output: "export"` — emit static `out/` instead of a server build.
- `trailingSlash: true` — locale routes resolve as folders (`/en/`), which static hosts serve cleanly.
- `images: { unoptimized: true }` — no image server in export; `next/image` renders plain `<img>` (blur placeholders still work).

> The `initOpenNextCloudflareForDev()` call at the bottom only runs in `next dev`; it's a no-op for the export build, so it can stay or be removed.

### 2. Removed `src/middleware.ts`
`output: "export"` **forbids** middleware (the build errors otherwise). The middleware previously did next-intl locale negotiation/redirect. Removing it means:
- No automatic `Accept-Language` detection.
- The bare `/` no longer redirects server-side (see step 4).
- Locale pages still exist because the `[locale]` segment uses `generateStaticParams` → `/en` and `/ar` are prebuilt.

### 3. `setRequestLocale` in every translated layout/segment
Static export pre-renders pages, so nothing may read request `headers()`. next-intl falls back to `headers()` unless you call `setRequestLocale(locale)`.
- Added it to `src/app/[locale]/(public)/layout.tsx` (it renders `Header`/`Footer`, which translate).
- Root `[locale]/layout.tsx`, `(auth)/layout.tsx`, `(app)/layout.tsx`, and the page already call it.
- Pattern: `await params`, then `setRequestLocale(locale as Locale)` **before** rendering translated children.

Symptom if missed: build fails with *"Route /[locale] with `dynamic = "error"` couldn't be rendered statically because it used `headers()`."*

### 4. Root redirect without middleware
Two redirect files (each read by a different host):
- `public/_redirects` → `/  /en/  302` — read by **Cloudflare Pages**.
- `public/serve.json` → `{ "redirects": [{ "source": "/", "destination": "/en" }] }` — read by **`npx serve`** for local preview.

Both live in `public/` so they're copied into `out/` on every build.


---

## How to apply (from a previous-setup checkout)

1. **Config** — add `output`, `trailingSlash`, `images.unoptimized` to `next.config.ts`.
2. **Delete** `src/middleware.ts`.
3. **Add** `setRequestLocale(locale as Locale)` to any layout/page that renders translated server components but doesn't already call it.
4. **Add** `public/_redirects` and `public/serve.json` with the `/ → /en` redirect.
7. **Build:** `npm run build` → produces `out/`.

---

## Build & run

```bash
npm ci
npm run build          # -> out/
```

**Preview locally** (static server; `_redirects` is Cloudflare-only, `serve.json` covers local):

```bash
npx serve out          # http://localhost:3000  → /en
```

---

## Deploy to Cloudflare Pages

Dashboard → **Workers & Pages → Create → Pages → Connect to Git**:

- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Environment variables:** `NODE_VERSION = 22`, plus any `NEXT_PUBLIC_*` (build-time).

Or **Direct Upload** the `out/` folder.

> The repo's `deploy` / `preview` / `upload` npm scripts target `@opennextjs/cloudflare` (the *old* Workers path). They are unused for static Pages and can be ignored or removed.

---

## Rollback (back to Workers SSR)

1. Remove `output: "export"` (and `trailingSlash` / `images.unoptimized` if undesired) from `next.config.ts`.
2. Restore `src/middleware.ts` (re-export the next-intl middleware from `@/i18n/routing`).
3. Keep `setRequestLocale` calls — they're valid for SSR too (harmless, enables static where possible).
4. Deploy with `npm run deploy` (`@opennextjs/cloudflare`).

`_redirects` / `serve.json` become unnecessary under SSR (middleware handles `/`), but are harmless.

---

## Gotchas

- **`next start` does not work** with `output: "export"` — serve `out/` as static files.
- Re-run the build on every deploy; `out/_next/static` filenames are content-hashed.
- Auth/dashboard pages render as static shells; gating is **client-side** (`AuthGuard` + hooks). The HTML is public — don't embed secrets in server components.
- No API routes / server actions / on-demand revalidation in export. Move any such logic to the client or an external API.
- Image optimization is off; for heavy image traffic rely on the Cloudflare CDN.
