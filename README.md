# sanskagarwal.com

Source for my personal website. The repo is a monorepo of a few independent pieces:

| Directory    | Stack                        | Purpose                                                          |
| ------------ | ---------------------------- | --------------------------------------------------------------- |
| `src/`       | Next.js, React, Tailwind CSS | The public-facing website (blog, notes, recipes, resume).       |
| `content/`   | Strapi CMS, PostgreSQL       | Headless CMS that serves blog and note content to the frontend. |
| `functions/` | Azure Functions, TypeScript  | Serverless backend (e.g. heartbeat / telemetry).                |
| `notes-llm/` | Python, OpenAI               | Tooling to turn PDFs/notes into content using an LLM.           |
| `infra/`     | Bicep                        | Infrastructure-as-code for all Azure resources.                 |

## Getting started

### Website (`src/`)

```bash
cd src
npm install
npm run dev      # http://localhost:3000
```

Useful scripts: `npm run build`, `npm run lint`, `npm run test:a11y`.

### CMS (`content/`)

```bash
cd content
npm install
npm run dev      # Strapi admin at http://localhost:1337/admin
```

### Functions (`functions/`)

```bash
cd functions
npm install
npm start        # runs the Azure Functions host locally
```

### Notes LLM (`notes-llm/`)

```bash
cd notes-llm
pip install -r requirements.txt
python main.py
```

## Infrastructure (`infra/`)

All Azure resources are defined as Bicep in [`infra/main.bicep`](infra/main.bicep),
with values supplied by [`infra/main.bicepparam`](infra/main.bicepparam). Secrets
and non-secret deploy-time config are read from environment variables (never
committed) and seeded into Key Vault. To set up GitHub Actions OIDC access to
Azure, run [`infra/scripts/setup-oidc.sh`](infra/scripts/setup-oidc.sh).

## Deployment

Each component is deployed to Azure via GitHub Actions using OIDC (no stored
publish profiles). The app components share a reusable build-and-deploy workflow
([`deploy-app.yml`](.github/workflows/deploy-app.yml)):

| Workflow                                                | Deploys                  | Target                     |
| ------------------------------------------------------- | ------------------------ | -------------------------- |
| [`publish.yml`](.github/workflows/publish.yml)          | `src/` (Next.js)         | Azure Web App              |
| [`content.yml`](.github/workflows/content.yml)          | `content/` (Strapi CMS)  | Azure Web App              |
| [`functions.yml`](.github/workflows/functions.yml)      | `functions/`             | Azure Function App         |
| [`infra.yml`](.github/workflows/infra.yml)              | `infra/` (Bicep)         | Resource group `website`   |

All workflows run automatically on pushes to `main` that touch the relevant
component's paths, and can also be triggered manually via **workflow_dispatch**
from the Actions tab. Each requires the `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,
and `AZURE_SUBSCRIPTION_ID` repo secrets for OIDC login.

## License

See [LICENSE](LICENSE).
