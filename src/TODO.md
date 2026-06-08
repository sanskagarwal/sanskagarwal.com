# TODO — `src/` Overhaul

Scope: `src/` Next.js 16 app only. Direction: **ground-up redesign for the homepage/dashboard**, **incremental improvements** for blog/notes/recipes/resume and the backend data layer.

## 🔴 High — foundations, security, dashboard redesign

- [x] Design-system foundation: add `next/font`, define design tokens (colors/spacing/typography), dark mode, and base UI primitives (Button, Card, Badge, Input) — `src/app/globals.css`, new `src/app/_components/ui/`.
- [x] **Ground-up homepage redesign**: convert from `"use client"` to a static server component; build a cohesive hero + about + featured content/links sections; drop rigid `h-3/6 xl:h-4/6` fractional heights and the fixed-cell SVG grid — `src/app/page.tsx`.
- [x] Introduce a shared repository/query layer; remove `SELECT *`, dedupe try/catch, add row→model mapping — `src/app/_dataprovider/`.
- [x] Harden DB pool: fix `ssl.rejectUnauthorized`, add env validation, use `bail` for non-transient errors, replace noisy `console.log` — `src/app/_dataprovider/RetryQuery.ts`.
- [x] Move hardcoded production URLs to env vars — `src/app/_utils/Constants.ts`.
- [x] Replace `export const dynamic = "force-dynamic"` with `revalidate`/cache tags across pages.

## 🟡 Medium — incremental UX, perf, consistency

### Page redesigns (apply new design system/tokens)

- [x] **Blog list page** redesign — `src/app/blog/page.tsx` + `src/app/_components/ContentComponent.tsx`.
- [x] **Notes list page** redesign (incl. AI-conversion banner) — `src/app/notes/page.tsx`.
- [x] **Blog/Note read page** redesign — typography, share, comments, theme-aware code blocks — `src/app/_components/ReadComponent.tsx`, `src/app/_utils/MarkdownToHTML.tsx`.
- [x] **Recipes page** redesign — `src/app/recipes/page.tsx` + `src/app/_components/RecipeList.tsx`.
- [x] **Resume page** redesign — viewer chrome, loading/skeleton, download — `src/app/resume/page.tsx` + `src/app/_components/ResumeViewer.tsx`.
- [x] **Error / loading / not-found** states restyle across routes — `src/app/blog/[url]/{error,loading,not-found}.tsx`, `src/app/notes/[url]/*`.

### Other

- [x] Incrementally split & polish the content list (reusable Card/Badge/Pagination, server-side filtering instead of loading all items) — `src/app/_components/ContentComponent.tsx`.
- [x] Refine layout shell + responsive sidebar/nav (apply new design tokens) — `src/app/layout.tsx`, `src/app/_components/Navbar.tsx`.
- [ ] Image optimization for recipes + lazy-load heavy libs (mermaid, react-pdf) — `src/app/_components/RecipeList.tsx`, `src/app/_components/ResumeViewer.tsx`.
- [ ] SEO: `sitemap.ts`, robots, per-page metadata, OG images, JSON-LD.
- [ ] Set Mermaid `securityLevel` + add CSP headers — `src/app/_components/Mermaid.tsx`, `src/next.config.js`.
- [ ] Accessibility pass: focus states, alt text, skip link, contrast.

## 🟢 Low — cleanup & tooling

- [ ] Remove dead `src/app/styles.module.css`; fix `@ts-expect-error` — `src/app/_utils/MarkdownToHTML.tsx`.
- [ ] Align CI Node version to 24.x — `.github/workflows/publish.yml`.
- [ ] Replace `console.*` with light structured logging.
- [ ] (Optional) Add a minimal test setup.
