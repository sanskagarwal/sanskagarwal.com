# Plan: Revamp content (Strapi CMS) deployment + IaC

## Confirmations

- ✅ The `content/` folder is a stock Strapi 5.29 app — all config files are boilerplate, `plugins.ts` is empty, content types and `types/generated` are auto-populated. The only hand-maintained surface is `package.json` dependencies.
- ✅ The `content/public/uploads` files are local test artifacts (gitignored) — **not** a modernization candidate. Excluded.
- ℹ️ The storage account + `sansk-cdn.azureedge.net` (classic, retiring) serve **static frontend assets** (the resume PDF), not Strapi media.
- ✅ **Shared Postgres, two roles**: server `sanskagarwal-db`, database `website`, schema `public`. Strapi (CMS) owns and migrates the tables (`blogs`, `notes`, Strapi internals) as `cms_user`; the frontend connects as a separate read-only user `web_user` (see `src/app/_dataprovider/RetryQuery.ts`). Phase 0 (✅ complete) converged this to a least-privilege allow-list model via `content/scripts/manage-db.mjs` — see below.
- ⚠️ **Security**: `src/.env` (with a live DB password) is present in the workspace. Confirm it is gitignored/untracked and rotate the password — track separately from this plan.

Deliver in phases so each part can be verified.

## Phase 0 — Database role & permission management script ✅ COMPLETE (applied to prod 2026-06-09)

Solves the user/permission pain, gives the admin full control without role-switching,
fixes a real security hole, and makes the model reproducible & inspectable.

### As-built (what was actually delivered)

- **Script: `content/scripts/manage-db.mjs`** (Node + `pg`, NOT bash/psql). Lives in
  `content/` because Strapi already depends on `pg`. Run via `cd content && npm run db -- <args>`.
  - Rewritten from an earlier bash version after Azure-specific psql edge cases
    (can't set `NOSUPERUSER`; grantor-dependency on REVOKE) made bash fragile.
  - **Transactional**: all critical changes run in one transaction (rolls back on
    failure — never half-applied). Risky cleanup steps each use their own savepoint,
    so a recoverable error degrades to a warning instead of aborting.
  - **Connection**: host/db/port/ssl default from `content/.env` (`DATABASE_*`). The
    admin login is NOT stored in the file — `PGUSER`/`PGPASSWORD` come from env vars
    or an interactive (hidden) prompt.
  - **Commands**: `status` (default, read-only report + drift) · `apply` (converge) ·
    `bootstrap` (converge on a fresh DB; Strapi still creates the tables itself).
  - **Flags**: `--read-tables "blogs notes"` (allow-list) · `--read-role` · `--cms-role`
    · `--web-role` · `--drop-role <name>` · `--dry-run`.

### Target model that was applied (verified zero drift)

- `cms_user` (LOGIN) — Strapi: owns all 39 tables; `USAGE`+`CREATE` on `public`.
- `app_readonly` (NOLOGIN group) — has `SELECT` on **only the allow-list** (`blogs`,
  `notes`). **No default privileges** — new tables stay unreadable by design until
  explicitly added via `--read-tables` and re-applied.
- `web_user` (LOGIN) — frontend: reads ONLY by inheriting `app_readonly`; holds **no
  direct grants**. `NOCREATEDB NOCREATEROLE`.
- `sanskar` (admin) — member of `cms_user` (manage/ALTER/DROP tables as yourself);
  removed from `web_user` and `app_readonly`.
- **Security fix**: the legacy `blogs` full-write grant on `web_user` was REVOKED
  (the frontend role could previously INSERT/UPDATE/DELETE/TRUNCATE blogs).
- **Cleanup**: the stray leftover Entra login role was dropped.
- Azure defaults (`public` owned by `azure_pg_admin`, `PUBLIC` usage) left untouched.

### Current DB state (after apply)

```mermaid
graph TD
    subgraph LOGIN["LOGIN roles"]
        sanskar["sanskar (admin)"]
        cms["cms_user (Strapi)"]
        web["web_user (frontend)"]
    end
    subgraph GROUP["GROUP roles (NOLOGIN)"]
        ro["app_readonly"]
        apg["azure_pg_admin"]
    end

    sanskar -->|member: manage tables as admin| cms
    sanskar -->|member: Azure admin| apg
    web -->|member: inherits SELECT| ro

    cms -->|OWNS + full DDL/DML| T[(all 39 tables)]
    ro -->|SELECT on ONLY blogs + notes| BN["blogs, notes"]
    web -.->|reads blogs+notes via group only| BN

    style web fill:#1b3a2b
    style ro fill:#1b2e4a
```

Verification (all clean): `npm run db` (status) shows no under-grant, no over-grant,
no direct `web_user` grants, and no default privileges. `apply` is idempotent.

### Operating it later

- Inspect: `cd content && npm run db` (status).
- Expose a new table to the frontend: `npm run db -- apply --read-tables "blogs notes recipes"`.
- Fresh server: `npm run db -- bootstrap` → start Strapi (creates tables) → `npm run db` (status).

### Follow-ups (not blocking)

- 🔴 **Rotate secrets**: the `sanskar` admin password was previously in `content/.env`
  and used on the terminal during testing; rotate `sanskar`, `web_user`, `cms_user`,
  and the Strapi `APP_KEYS`/JWT secrets. `content/.env` still holds live `cms_user`
  creds + Strapi secrets.
- 🟠 **Firewall**: server has an `AllowAll 0.0.0.0–255.255.255.255` rule — tighten later.
- ◻ Optional future hardening (deferred): dedicated `cms` schema, group-owner role.

## Phase 0.5 — Upgrade Strapi & dependencies ✅ COMPLETE (2026-06-09)

Refresh the CMS dependencies before modernizing the pipeline/IaC so the deployment
target is the current Strapi line. Strapi ships an official codemod-driven updater
(`@strapi/upgrade`) — used rather than hand-bumping versions.

### As-built

1. **Strapi 5.29.0 → 5.47.1** via `npx @strapi/upgrade minor` from `content/` (bumped
   `@strapi/strapi`, `@strapi/plugin-cloud`, `@strapi/plugin-users-permissions`; no
   source codemods were needed — only `package.json` + lockfile changed).
2. **Non-Strapi deps** refreshed to current floors within their majors: `@swc/core`
   `^1.15.40`, `pg` `^8.21.0`, `react`/`react-dom` `^18.3.1` (kept on 18.x — Strapi 5
   peer), `react-router-dom` `^6.30.4`, `styled-components` `^6.1.19` (held at 6.1.x —
   6.4.x drags in a `react-native` optional peer that demands `@types/react@19` and
   breaks install against Strapi's React 18).
3. **Node engine** `22.x` → `24.x` — matches the rest of the repo (`src` = 24.x,
   `functions` = >=24, `webApp.bicep` default `NODE|24-lts`) and is within Strapi
   5.47's supported range (`>=20.0.0 <=24.x.x`); also clears the EBADENGINE warning on
   the local Node 24 toolchain.
4. **devDependencies** — left empty (none added). The stock Strapi TS scaffold can
   ship `typescript` + `@types/*`, but they are redundant here: `@strapi/strapi` pulls
   `typescript@5.4.5` transitively and `strapi build` uses it, so the build compiles TS
   without them. Keeping `package.json` minimal avoids a second TS/types version to
   maintain. (TS 6 is intentionally avoided regardless — Strapi 5.47 is pinned to TS
   5.4.5, unlike the Next.js frontend in `src`.)
5. **tsconfig** — left as-is by design: `content/tsconfig.json` and
   `src/admin/tsconfig.json` only `extends` Strapi's managed base configs
   (`@strapi/typescript-utils/tsconfigs/{server,admin}`), which were upgraded
   transitively to 5.47.1 by the package bump. Hand-editing them would diverge from
   boilerplate.
6. **eslint** — N/A: the Strapi 5 scaffold does not ship an eslint config and none
   exists in `content/`, so there is nothing to upgrade. Adding linting here would be
   net-new tooling (a separate decision), not part of this dependency refresh.
7. Verify: `npm install && npm run build` passes (TS compile + admin panel build).
   `npm run db` (status, zero-drift) and a `strapi develop` boot remain a manual local
   check (require prod DB creds).

## Phase 1 — Modernize the CMS pipeline (OIDC) ✅ COMPLETE (2026-06-09)

1. ✅ Rewrote `.github/workflows/content.yml` to call the reusable `.github/workflows/deploy-app.yml` with `package-path: content`, `app-name: sanskagarwal-cms`, `deploy-type: webapp`, `node-version: 24.x`, `secrets: inherit`, and `id-token: write` — now identical in shape to `publish.yml`/`functions.yml`.
2. ✅ Dropped the old `AZURE_CONTENTAPP_PUBLISH_PROFILE` flow.
3. 🟠 Manual follow-up: delete the now-unused `AZURE_CONTENTAPP_PUBLISH_PROFILE` GitHub secret.

## Phase 2 — Bring the CMS web app into IaC ✅ COMPLETE (2026-06-09)

### As-built

1. ✅ Generalized `infra/modules/webApp.bicep` — the hardcoded `keyVaultSecretSettings` (DATABASE_PASSWORD/TANDOOR_TOKEN/optional DATABASE_CA_CERT) and the `includeDatabaseCaCert` param were replaced by a single `keyVaultSecretRefs` array param (`{ name, secretName }[]`); the module builds the `@Microsoft.KeyVault(...)` references. Serves both the frontend and the CMS. Runtime stays on the module's existing `NODE|24-lts` default.
2. ✅ Added secrets to `infra/modules/keyVault.bicep` (each conditional on a non-empty value): `database-cms-password`, `strapi-app-keys`, `strapi-api-token-salt`, `strapi-admin-jwt-secret`, `strapi-transfer-token-salt`, `strapi-jwt-secret`.
3. ✅ `infra/main.bicep`: added a `cmsApp` module (`sanskagarwal-cms`) on `plan-sanskagarwal` with `NODE_ENV=production`, `DATABASE_CLIENT=postgres`, reused `DATABASE_HOST/NAME/PORT/SSL/SSL_REJECT_UNAUTHORIZED`, `DATABASE_USERNAME=cms_user`, the 6 CMS secret refs (env names `DATABASE_PASSWORD`/`APP_KEYS`/`API_TOKEN_SALT`/`ADMIN_JWT_SECRET`/`TRANSFER_TOKEN_SALT`/`JWT_SECRET` — verified against `content/config/{server,admin,database}.ts`), the `cms.sanskagarwal.com` hostname, a `cmsKeyVaultRoleAssignment`, and a `cmsCertificate` + `cmsSniBinding` (reusing the existing managed-cert/SNI modules). The frontend `webApp` call now passes `webAppSecretRefs` instead of `includeDatabaseCaCert`.
4. ✅ Updated `infra/main.bicepparam` (new `cmsAppName`/`cmsDomain`/`databaseCmsUsername` + `readEnvironmentVariable` for `DATABASE_CMS_PASSWORD` and the 5 `STRAPI_*` secrets) and `.github/workflows/infra.yml` (the new env vars added to both the what-if and deploy steps).
5. ✅ `main.bicep` + `main.bicepparam` compile clean (no errors/warnings).

### Remaining manual steps

- 🟠 Create the GitHub secrets: `DATABASE_CMS_PASSWORD`, `STRAPI_APP_KEYS`, `STRAPI_API_TOKEN_SALT`, `STRAPI_ADMIN_JWT_SECRET`, `STRAPI_TRANSFER_TOKEN_SALT`, `STRAPI_JWT_SECRET` (reuse the live values from `content/.env`, or rotate per the Phase 0 follow-up).
- 🟠 DNS: `CNAME admin → sanskagarwal-cms.azurewebsites.net` (must exist before the managed cert can be issued).
- 🟠 Run `Deploy Infrastructure` (what-if should be clean), then `Deploy CMS Backend`.

## Phase 3 — Storage account + Azure Front Door (static assets) (independent of 1–2)

1. New storage-account module (separate from the Functions host storage) with a public `public` container for `/assets/`.
2. New `frontDoor.bicep` module: Front Door Standard profile + endpoint + origin group (blob origin) + route, using the **default Front Door endpoint hostname** (`<name>-<hash>.z01.azurefd.net`) — no custom domain / DNS work. Wire into `infra/main.bicep`/bicepparam.
3. Update `src/app/_utils/Constants.ts` `Resume_URI` default to the new Front Door default endpoint hostname.
4. Manual: migrate the resume PDF to the new storage; decommission the classic `sansk-cdn` (no DNS changes needed since we use the default FD hostname).

## Verification

1. Phase 0 ✅ — `npm run db -- apply` is idempotent (re-run = no-op); `npm run db`
   (status) reports zero drift; the admin (`sanskar`) can `ALTER`/`DROP` Strapi tables
   as itself; `web_user` reads only `blogs`+`notes` via `app_readonly`, with no direct
   grants. (Applied to prod 2026-06-09.)
2. Phase 1: `cd content && npm install && npm run build` passes; `Deploy CMS Backend` runs green via OIDC.
3. Phase 2: `az deployment group what-if` is clean; CMS admin reachable at `cms.sanskagarwal.com` over HTTPS.
4. Phase 3: resume PDF loads via the Front Door URL on the live frontend.

## Decisions

- Excluded: Strapi media/upload-provider work (local uploads are test data).
- CDN → Azure Front Door Standard using the **default endpoint hostname** (no custom domain).
- CMS reuses `plan-sanskagarwal` (P0v3) — capacity is fine; load is minimal.
- DB management is a Node script (`content/scripts/manage-db.mjs`, `npm run db`) run
  **locally** by the admin (not in CI). web_user is read-only on an explicit
  allow-list (`blogs`, `notes`); no default privileges — new tables are exposed
  deliberately by re-running `apply --read-tables`.

## Further considerations

- ✅ CMS database — same Postgres DB (`website`), separate users (`cms_user` / `web_user`); Phase 2 adds a `database-cms-password` secret.
- ✅ Front Door hostname — default endpoint hostname (uglier URL, no DNS work).
- ✅ Capacity — single P0v3 plan is sufficient; minimal load.
- ✅ DB management runs locally as a deliberate manual step against production (`npm run db`).
