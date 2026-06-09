# content/

Headless CMS for sanskagarwal.com, built on [Strapi](https://strapi.io) and
backed by PostgreSQL. It serves blog and note content to the public website in
[`src/`](../src). See the root [README.md](../README.md) and
[AGENTS.md](../AGENTS.md) for the monorepo overview and conventions.

## Requirements

- Node 24
- A PostgreSQL database (connection configured via environment variables)

## Getting started

```bash
cd content
npm install
npm run dev      # Strapi admin at http://localhost:1337/admin
```

## Scripts

- `npm run dev` - start Strapi in develop mode with autoReload.
- `npm run build` - build the admin panel.
- `npm run start` - start Strapi with autoReload disabled (production).
- `npm run db` - run the database management script in [`scripts/`](scripts/README.md).

## Configuration

Runtime config lives in [`config/`](config) and reads from environment
variables (database connection, app keys, JWT secrets). Never commit secret
values. In Azure these are supplied at deploy time and sourced from Key Vault.

## Deployment

Deployed to an Azure Web App via the
[`content.yml`](../.github/workflows/content.yml) GitHub Actions workflow, which
uses the shared [`deploy-app.yml`](../.github/workflows/deploy-app.yml) and Azure
OIDC. It runs on pushes to `main` that touch `content/**`, or manually via
workflow_dispatch.
