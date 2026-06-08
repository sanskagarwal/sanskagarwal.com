# Plan: UX Refresh Across `src/` Pages

A **moderate refresh** of the Next.js 16 app under `src/` — keep the teal/slate visual language and current layout, but level up accessibility, loading/error states, micro-interactions, mobile polish, navigation, and SEO. A lightweight motion library (`motion`) is added, with all animation gated on `prefers-reduced-motion`. Much of the prior redesign work in [src/TODO.md](src/TODO.md) is done; this plan targets the remaining rough edges surfaced in the audit.

## Steps

### Phase 0 — Foundations (blocks later phases)
1. Install `motion`; add a `Reveal` scroll-animation primitive in [_components/ui/](src/app/_components/ui).
2. Extend [globals.css](src/app/globals.css): motion tokens, reduced-motion guard, dark-aware scrollbar, base `:focus-visible`, `.sr-only` + skip-link styles.
3. [layout.tsx](src/app/layout.tsx): add skip-to-content link, wrap children in `<main id="main">`, expand metadata.

### Phase 1 — Accessibility (parallel after Phase 0)
4. [Navbar.tsx](src/app/_components/Navbar.tsx): `aria-current`, `role="navigation"`, ESC-to-close + focus trap, `aria-expanded`, better alt text.
5. [ThemeToggle.tsx](src/app/_components/ThemeToggle.tsx): `aria-pressed`/live announce, larger touch target.
6. [ContentComponent.tsx](src/app/_components/ContentComponent.tsx): filter group labeling, `aria-current` on active page, live result-count region, visible "Page X of Y".
7. [ResumeViewer.tsx](src/app/_components/ResumeViewer.tsx): screen-reader fallback/download link, error state, multi-page handling.
8. Blog/notes `loading.tsx` skeletons: `role="status"`, `aria-hidden` bars.

### Phase 2 — Loading & error states (parallel after Phase 0)
9. Add homepage `loading.tsx`/`error.tsx` and missing per-route `error.tsx` for recipes/resume/list pages.
10. [RecipeList.tsx](src/app/_components/RecipeList.tsx): inline error feedback on fetch failure; clearer button label.
11. Richer empty states (icon + copy) across lists and homepage.
12. `not-found.tsx`: add next-step suggestions.

### Phase 3 — Micro-interactions (depends on Phase 0)
13. Card hover lift/shadow on blog/note/recipe/home cards.
14. Staggered reveal-on-scroll for homepage sections and grids.
15. Button/Badge/nav hover polish + page fade transitions.

### Phase 4 — Mobile & responsive polish (parallel)
16. [page.tsx](src/app/page.tsx): responsive hero image + social icon sizing.
17. ContentComponent: compact mobile pagination + filter wrap.
18. [ReadComponent.tsx](src/app/_components/ReadComponent.tsx)/[ReadingShell.tsx](src/app/_components/ReadingShell.tsx): back link, optional TOC, prev/next nav, tighter small-screen padding.

### Phase 5 — SEO & discoverability (parallel)
19. Add `sitemap.ts`, `robots.ts`, per-page metadata, OG image, article JSON-LD.
20. Persist category/search filters to URL searchParams (shareable, survives reload).

### Phase 6 — Cleanup
21. Remove dead [styles.module.css](src/app/styles.module.css) if confirmed unused.

## Verification
1. `cd src && npm run build` after each step.
2. Keyboard-only pass: Tab/Shift-Tab/ESC, skip link, visible focus everywhere.
3. Throttle network → skeletons; force fetch error → error UI.
4. Mobile <375px: hero, pagination, drawer, cards.
5. OS reduced-motion → animations disabled.
6. Verify `/sitemap.xml`, `/robots.txt`, OG tags; run Lighthouse a11y/SEO.

## Decisions
- Keep current palette/layout; refine interactions only (moderate refresh).
- Add `motion`; gate all motion on `prefers-reduced-motion`.
- Excluded: backend/data layer, CSP headers (separate security task), automated tests.

## Further Considerations
1. SEO scope — full treatment (sitemap + robots + per-page metadata + OG images + JSON-LD) or a lean subset first? Recommend: full, it's mostly additive and low-risk.
2. Resume accessibility — react-pdf can't expose real text. Options: A) add prominent "Download PDF" + summary text fallback (low effort, recommended), B) maintain an HTML resume version (high effort, best a11y), C) leave as-is.
3. OG images — A) single static branded image (fast), or B) dynamic per-article `opengraph-image` via `@vercel/og`/ImageResponse (nicer, more work)? Recommend: B for articles, A elsewhere.
