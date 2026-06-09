# AGENTS.md

Guidance for AI coding agents working in this repository. See [README.md](README.md)
for a human-oriented overview.

## Repo layout

This is a monorepo of independent components, each with its own toolchain:

| Directory    | Stack                        | Notes                                              |
| ------------ | ---------------------------- | -------------------------------------------------- |
| `src/`       | Next.js, React, Tailwind CSS | Public website. Node 24. Deployed as standalone.   |
| `content/`   | Strapi CMS, PostgreSQL       | Headless CMS. Node 24.                             |
| `functions/` | Azure Functions, TypeScript  | Heartbeat / telemetry. Node 24, compiled with tsc. |
| `notes-llm/` | Python, OpenAI               | PDF/notes -> content tooling.                       |
| `infra/`     | Bicep                        | Azure infrastructure-as-code.                      |

Each component is self-contained: `cd` into its directory before running its
package manager or scripts. Do not assume a shared root `package.json`.

## Build & verify

Run commands from the relevant component directory:

- `src/`: `npm run build`, `npm run lint`, `npm run knip`, `npm run test:a11y` (Playwright).
- `content/`: `npm run build`, `npm run dev` (Strapi admin at `:1337`).
- `functions/`: `npm run build` (tsc), `npm start` (Functions host).
- `notes-llm/`: `pip install -r requirements.txt`, `python main.py`.

After editing a component, build it from its directory to verify before finishing.

## Conventions

- TypeScript everywhere in JS/TS components; keep types strict.
- Match the existing indentation style per directory (`src/`/`content/`/`functions/`
  use the formatting already present in each file; don't reformat unrelated lines).
- Don't add comments, docstrings, or type annotations to code you didn't change.
- Make only the changes requested; avoid drive-by refactors and new abstractions.
- Avoid "AI-looking" special characters in code, comments, docs, and
  user-facing strings. Use plain ASCII instead. Keep writing simple, subtle, and
  professional. Specifically avoid:
  - Dashes: em-dash (U+2014), en-dash (U+2013), horizontal bar (U+2015),
    math minus (U+2212), soft hyphen (U+00AD). Use a plain hyphen `-`.
  - Quotes/punctuation: curly quotes (U+2018/2019/201C/201D), ellipsis (U+2026),
    low quotes, prime marks. Use straight quotes and `...`.
  - Invisible/spacing: non-breaking space (U+00A0), narrow/thin spaces, zero-width
    characters (U+200B/200C/200D), BOM (U+FEFF). Use a normal space.
  - Symbols/arrows: arrows (`->` etc.), legal marks (TM/(C)/(R)), and decorative
    math operators. Spell them out or use ASCII.
  - Emojis and decorative glyphs (check/cross/warning/star) in code, comments,
    and docs.
## Infrastructure & secrets

- Azure resources live in [`infra/main.bicep`](infra/main.bicep); values in
  [`infra/main.bicepparam`](infra/main.bicepparam).
- Secrets are read from environment variables at deploy time and seeded into
  Key Vault. **Never commit secret values** or hardcode them in Bicep/params.
- When generating or modifying Bicep, consult Bicep best practices first.

## Deployment

- Each component has a GitHub Actions workflow in `.github/workflows/`.
- App components share the reusable [`deploy-app.yml`](.github/workflows/deploy-app.yml).
- Deploys use Azure OIDC (no stored publish profiles); they run on pushes to
  `main` that touch the component's paths, and can also be triggered manually
  via `workflow_dispatch`.

## Safety

- Don't run `brew` commands; tell the user the command to run instead.
- Don't push, force-push, or run destructive git/Azure commands without asking.
- Treat anything under `__blobstorage__/`, `__queuestorage__/`, and the
  `__azurite_db_*` files as local Azurite emulator state: do not edit or commit
  changes to them.
