\# Plan: Revamp `functions/` — OpenTelemetry + IaC Alerting + OIDC Deploy

Rewrite the heartbeat function app from scratch (reusing the **logic only**, no old code): modernize packages to Node 24 / TS 5, migrate telemetry from the legacy `applicationinsights` SDK to **Azure Functions native OpenTelemetry**, add full Bicep IaC for the Function App + observability + email alerting, and replace the publish-profile deploy with OIDC. The reusable `deploy-app.yml` already supports OIDC `functionapp` deploys, so deployment modernization is mostly rewiring `functions.yml`.

## Steps

### Phase 1 — Modernize functions code (rewrite)
1. `functions/package.json`: TS ^5, `@types/node` ^24, keep `@azure/functions` ^4; **remove** `applicationinsights` + `axios`; **add** `@azure/monitor-opentelemetry`, `@azure/functions-opentelemetry-instrumentation`, `@opentelemetry/api`; `engines.node >=24`.
2. `functions/tsconfig.json` → target ES2022, `strict: true`. `functions/host.json` → add `"telemetryMode": "OpenTelemetry"`. `functions/local.settings.json` → scrub the hardcoded App Insights key.
3. `functions/src/index.ts` → bootstrap OTel (`useAzureMonitor()` + register `AzureFunctionsInstrumentation`) before app config.
4. `functions/src/telemetry.ts` → rewrite on the OTel API: emit a per-endpoint health **metric** + a structured **log record** (attrs `endpoint`, `healthy:false`, `status`, Error severity on failure) — query-friendly for alerts.
5. `functions/src/constants.ts` → keep the 8 endpoints + expected content (clean, typed). `functions/src/functions/heartbeat.ts` → rewrite timer trigger using **native fetch** (with `AbortSignal.timeout`), validate `res.ok` + body content, call telemetry helpers.

### Phase 2 — Observability infra (Bicep) *(parallel with Phase 1)*
6. New `logAnalytics.bicep` (workspace) + `appInsights.bicep` (workspace-based component, outputs connection string); wire into `main.bicep`.

### Phase 3 — Function App infra (Bicep) *(depends on Phase 2)*
7. New `storageAccount.bicep` + `functionApp.bicep` (kind `functionapp,linux`, **on the existing `plan-sanskagarwal` plan**, system-assigned identity, Node|24, App Insights connection string, identity-based `AzureWebJobsStorage`, basic-auth disabled) + `storageRoleAssignment.bicep`. Mirror the OIDC/basic-auth pattern from `webApp.bicep`.

### Phase 4 — Alerting infra (Bicep) *(depends on Phases 2–3)*
8. New `actionGroup.bicep` (email receiver from `alertEmailAddress` param) + `heartbeatAlert.bicep` (`scheduledQueryRules`, KQL over `AppTraces`/`AppExceptions` counting `healthy=false` failures in a 1h window, threshold > 0, linked to the action group).

### Phase 5 — Deployment modernization *(depends on Phase 3)*
9. Rewrite `.github/workflows/functions.yml` to call `deploy-app.yml` (`deploy-type=functionapp`, `node-version=24.x`, `secrets: inherit`), re-enable push on `functions/**`, drop the publish profile. Add new params to `main.bicepparam` (incl. `alertEmailAddress = readEnvironmentVariable('ALERT_EMAIL','')`) and `ALERT_EMAIL` env to `infra.yml`.

### Phase 6 — Verification
10. `cd functions && npm install && npm run build`; `func start` locally; `az bicep build` + `az deployment group what-if`; post-deploy confirm telemetry lands in new App Insights and a forced failure fires the email alert.

## Relevant files
- `functions/package.json`, `functions/tsconfig.json`, `functions/host.json`, `functions/local.settings.json` — modernize config; switch to OTel.
- `functions/src/index.ts`, `functions/src/telemetry.ts`, `functions/src/constants.ts`, `functions/src/functions/heartbeat.ts` — full rewrite (logic preserved).
- `infra/main.bicep`, `infra/main.bicepparam` — wire new modules + params.
- `infra/modules/` — new: `logAnalytics.bicep`, `appInsights.bicep`, `storageAccount.bicep`, `functionApp.bicep`, `storageRoleAssignment.bicep`, `actionGroup.bicep`, `heartbeatAlert.bicep`; reference `webApp.bicep` for the OIDC/basic-auth + plan pattern.
- `.github/workflows/functions.yml` (rewrite to OIDC via `deploy-app.yml`), `.github/workflows/infra.yml` (add `ALERT_EMAIL`).

## Verification
1. `cd functions && npm install && npm run build` clean; `func start` runs heartbeat without OTel init crash on empty connection string.
2. `az bicep build --file infra/main.bicep` compiles; `az deployment group what-if` succeeds.
3. Post-deploy: heartbeat telemetry in new App Insights (`AppTraces`/`AppMetrics`); forced endpoint failure → scheduled-query rule → email received.
4. `functions.yml` deploys via OIDC, no publish profile.

## Decisions
- Email-only Action Group; alerts fire from Azure scheduled-query rules (function only emits telemetry).
- Function App reuses the existing P0v3 plan; Storage + Function App fully IaC-managed.
- New workspace-based App Insights + Log Analytics in Bicep; drop axios → native fetch; Node 24.
- Excluded: SMS/webhook channels, separate consumption plan.

## Further Considerations
1. **Email value** — store as GitHub secret `ALERT_EMAIL` + `bicepparam` env var. Confirm the address (or leave it as a parameter to fill in).
2. **Storage auth** — identity-based `AzureWebJobsStorage` (keyless, recommended) vs connection string (simpler). Recommend identity-based.
3. **Detection latency** — keep hourly timer (alert window ≥ cadence) or tighten to 15 min for faster alerts. Recommend keeping hourly, configurable via CRON.
