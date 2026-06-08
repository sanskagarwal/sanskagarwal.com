# Plan: Overhaul of `src/` (frontend UI + backend data layer)

A focused improvement plan for the Next.js 16 / React 19 / Tailwind 4 personal site. You want a real overhaul — the UI is in a bad state and the backend data layer is messy. Below is what I found (grounded in the code) and what the TODO.md captures, grouped High/Medium/Low. Scope is **`src/` only**.

**Direction:** ground-up redesign for the homepage/dashboard; incremental improvements for the rest (blog/notes/recipes/resume, layout, backend data layer).

## What I found

### Frontend / UI
- `src/app/page.tsx` is `"use client"` despite being fully static; uses rigid fractional heights (`h-3/6 xl:h-4/6`) and an awkward 2-column grid with floating decorative SVGs in fixed cells. No cohesive hero, about, or projects section.
- `src/app/layout.tsx` + `src/app/globals.css`: bare CSS-grid sidebar shell. No `next/font`, no design tokens, no dark mode, minimal metadata.
- `src/app/_components/ContentComponent.tsx` (~380 lines): all client-side; manual color map; fragile category→color logic in a `useEffect`; downloads **all** items then filters/searches client-side; plain card design.
- `src/app/styles.module.css` is dead/unused.
- No shared UI primitives (Button/Card/Badge/Input); Tailwind colors hardcoded and scattered.

### Backend / data layer
- `src/app/_dataprovider/RetryQuery.ts`: raw `pg` Pool with `ssl.rejectUnauthorized: false` (security risk), noisy `console.log`, no env validation, never calls `bail` (retries non-transient errors), unsafe `<T>` cast.
- `src/app/_dataprovider/BlogDataProvider.ts` / `NoteDataProvider.ts`: raw SQL, `SELECT *`, duplicated try/catch, hardcoded columns, no shared repository abstraction, no row→model validation.
- `src/app/_dataprovider/RecipeDataProvider.ts`: fetch+bearer pattern, inconsistent with the pg providers.
- `src/app/_utils/Constants.ts`: hardcoded production URLs that should be env vars.

### Performance / SEO / CI
- `export const dynamic = "force-dynamic"` on every page → no ISR/SSG/caching; client-side filtering downloads everything; heavy `mermaid`/`react-pdf`; unoptimized recipe images.
- No `sitemap.ts`, robots, OG images, or structured data.
- CI `.github/workflows/publish.yml` uses Node 22.x vs `engines` 24.x.

## TODO.md structure (priority-grouped, checkboxes)

### 🔴 High — foundations, security, dashboard redesign
1. Design-system foundation: `next/font`, design tokens, dark mode, base UI primitives (Button/Card/Badge/Input).
2. **Ground-up homepage/dashboard redesign** — static server component, cohesive hero + about + featured content; drop fractional heights and fixed-cell SVG grid (`src/app/page.tsx`).
3. Backend: introduce a shared repository/query layer; remove `SELECT *`, dedupe try/catch, add row→model mapping (`src/app/_dataprovider/`).
4. Harden DB pool: fix `ssl.rejectUnauthorized`, add env validation, use `bail` for non-transient errors (`src/app/_dataprovider/RetryQuery.ts`).
5. Move hardcoded URLs to env vars (`src/app/_utils/Constants.ts`).
6. Replace `force-dynamic` with `revalidate`/cache tags across pages.

### 🟡 Medium — incremental UX, perf, consistency
7. Incrementally split & polish the content list; move filtering server-side; reusable Card/Badge/Pagination (`src/app/_components/ContentComponent.tsx`).
8. Refine layout shell + responsive sidebar/nav with new design tokens (`src/app/layout.tsx`, `src/app/_components/Navbar.tsx`).
9. Image optimization (recipes) + lazy-load heavy libs (mermaid, react-pdf).
10. SEO: `sitemap.ts`, robots, per-page metadata, OG images, JSON-LD.
11. Mermaid `securityLevel` + CSP headers in `src/next.config.js`.
12. A11y pass: focus states, alt text, skip link, contrast.

### 🟢 Low — cleanup & tooling
13. Remove dead `src/app/styles.module.css`; fix `@ts-expect-error` in `src/app/_utils/MarkdownToHTML.tsx`.
14. Align CI Node version to 24.x (`.github/workflows/publish.yml`).
15. Replace `console.*` with light structured logging.
16. (Optional) Add a minimal test setup.

## Decisions / scope
- **In scope:** `src/` only. **Excluded:** `functions/`, `content/` (Strapi), `notes-llm/`.
- **UI direction:** ground-up redesign for the homepage/dashboard; incremental for blog/notes/recipes/resume lists, layout, and backend.
- TODO is concise one-liners with file references, grouped by priority with `[ ]` checkboxes.
- Testing wasn't a top focus, so it's a single optional Low item.
