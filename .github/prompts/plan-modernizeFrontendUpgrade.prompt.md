# Plan: Modernize + upgrade frontend (`src/`) — Next 16 + React 19 + RSC, on Node 24

Beyond version bumps, the big modernization is **eliminating a redundant data layer**: today your detail pages are *client* components that `useSWR` to hit internal API routes (`/api/blogs/[url]`) which merely re-call your `server-only` data providers. Modern App Router fetches directly in Server Components — so we delete the proxy routes, drop SWR where it's not needed, and add proper `loading`/`error`/`not-found` + per-page SEO. Sequencing keeps every phase buildable: architecture first (still React 18), then remove semantic-ui (the React 19 blocker), then the framework jump, then remaining deps/config.

## Verified latest versions (npm, 2026-06-08)

- `next` 16.2.7 (peer `react` ^19)
- `react` / `react-dom` 19.2.7
- `eslint` 10.4.1 (engines: node ^20.19 || ^22.13 || >=24)
- `eslint-config-next` 16.2.7 (flat config, peer `eslint` >=9)
- `react-icons` 5.6.0
- `react-pdf` 10.4.1 (pdfjs-dist 5.x; worker now `.mjs`; CSS paths drop `/esm/`)

## Current architecture (anti-patterns found)

- Detail pages `blog/[url]`, `notes/[url]` are **client** components using `useSWR` → call internal `/api/blogs/[url]` etc. → which call the `server-only` data providers. Redundant proxy layer.
- Listing pages (`blog`/`notes`/`recipes`) use client `useSWR` with interactivity (search / label filter / pagination).
- Internal API routes exist only to feed client SWR; they duplicate the data providers.
- `Constants.URI` hardcodes localhost/prod for absolute client-side fetches.
- Manual `isLoading` skeletons + error `<div>`s everywhere.
- Leftover semantic CSS classes (`ui card`, `ui header`, `ui text`) in `ReadComponent.tsx`, `recipes/page.tsx`.
- Only static root metadata; no per-page SEO.
- tsconfig `target: es5`, `moduleResolution: node`. `tailwind.config.js` present (v4 prefers CSS-first).
- `next lint` script (removed in Next 16).

## Decisions (approved)

- Detail pages → async Server Components, fetch via data providers directly, **delete** redundant `/api/blogs/[url]` & `/api/notes/[url]`.
- Listing pages → Server Component fetches data, passes to a Client Component for interactivity. Remove listing SWR + `/api/blogs` & `/api/notes` listing routes.
- Adopt `loading.tsx` / `error.tsx` / `not-found.tsx` + Suspense + `generateMetadata`.
- `semantic-ui-react` / `semantic-ui-css` → `react-icons` + hand-rolled Tailwind components.
- tsconfig `es5` → `ES2022` + `moduleResolution: bundler`.
- Tailwind v4 CSS-first (drop `tailwind.config.js`, use `@theme` in `globals.css`).
- Replace `next lint` script with the ESLint CLI.
- CI / `publish.yml` / Azure are **out of scope** (handled separately). Still bump `package.json` `engines` → `24.x`.

---

## Phase 1 — Architecture: move to RSC data fetching (stays on Next 14 / React 18)

1. `blog/[url]/page.tsx` & `notes/[url]/page.tsx` → async Server Components calling `getBlog` / `getNote` directly (await `params`); add `generateMetadata` (+ optional `generateStaticParams`). Simplify `ReadComponent.tsx` to take `readModel` directly (drop `isLoading`/`error` props).
2. Add `loading.tsx`, `not-found.tsx`, `error.tsx` for the detail routes.
3. Listing: `blog/page.tsx` / `notes/page.tsx` → Server Component fetches data, passes to a Client `ContentList` (keeps search/filter/pagination, drops `useSWR`). `recipes/page.tsx` → Server Component + Client `RecipeList` (keeps get-link interactivity).
4. Replace the recipe get-link `/api/recipes/[link]` with a **Server Action** (recommended).
5. Delete the now-redundant API routes under `api/`, plus `ClientDataProvider.ts` and the `Constants.URI` absolute-fetch hack.
6. **Verify:** `npm run build` + dev smoke test every page.

## Phase 2 — Remove `semantic-ui-react` / `semantic-ui-css` (still React 18; unblocks React 19)

7. `Icon` → `react-icons` across `page.tsx`, `resume/page.tsx`, `Navbar.tsx`, `ContentComponent.tsx`, recipes.
8. `Button` / `Menu` / `Divider` (Navbar) → Tailwind. *(parallel with 9)*
9. `Card` family + `Label` → reusable Tailwind components; `Input` + `Pagination` + `SemanticCOLORS` → Tailwind input, hand-rolled pagination, local color union.
10. `Popup` (`SocialShare.tsx`) → tooltip; replace leftover `ui card/header/text` classes.
11. Remove the CSS import in `layout.tsx`; drop both packages from `package.json`.
12. **Verify:** build + visual check.

## Phase 3 — Next 14→16 + React 18→19 + ESLint flat config

13. Bump `next`, `react`, `react-dom`, type packages, `eslint-config-next` → 16, `eslint` → 10.
14. Confirm async `params` on any remaining dynamic handlers (most deleted in Phase 1).
15. Migrate `.eslintrc.json` → `eslint.config.mjs` (flat config); change the `next lint` script (removed in Next 16) to the ESLint CLI.
16. Review `next.config.js` for deprecated keys.
17. **Verify:** build + lint + dev smoke test.

## Phase 4 — Remaining deps + config modernization

18. `react-pdf` 8→10 (`resume/page.tsx`): worker → `.mjs`, CSS paths drop `/esm/`.
19. Bump all remaining deps to latest; drop ones made unused by Phase 1 (`swr`, possibly `react-content-loader`).
20. tsconfig `target` es5→ES2022, `moduleResolution` node→bundler; Tailwind v4 CSS-first (remove `tailwind.config.js`, use `@theme` in `globals.css`); `engines.node` → `24.x`.
21. **Verify:** build + lint + full dev smoke test.

---

## Notes

- All four modernization choices accepted (RSC detail + listing, App Router UX conventions, config modernization).
- CI / `publish.yml` / Azure stay separate; only `package.json` `engines` bumped here.
- Research bonus: no `forwardRef` / `defaultProps` / `propTypes` / `cookies()` / `headers()` usage — React 19 / Next 16 risk is mostly just async `params`, largely eliminated by the Phase 1 RSC work.

## Further Considerations

1. Recipe get-link: Server Action (recommended) vs keeping an API route.
2. Detail pages: SSG via `generateStaticParams` (recommended for blogs) vs dynamic SSR.
3. Loading UI: keep `react-content-loader` skeletons vs simple Tailwind skeletons in `loading.tsx`.
4. `react-syntax-highlighter` → Shiki (what Next's own docs use) — optional, out of current scope.
