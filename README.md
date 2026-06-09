# sanskagarwal.com

Source for my personal website. The repo is a monorepo of a few independent pieces:

| Directory    | Stack                        | Purpose                                                          |
| ------------ | ---------------------------- | --------------------------------------------------------------- |
| `src/`       | Next.js, React, Tailwind CSS | The public-facing website (blog, notes, recipes, resume).       |
| `content/`   | Strapi CMS, PostgreSQL       | Headless CMS that serves blog and note content to the frontend. |
| `functions/` | Azure Functions, TypeScript  | Serverless backend (e.g. heartbeat / telemetry).                |
| `notes-llm/` | Python, OpenAI               | Tooling to turn PDFs/notes into content using an LLM.           |

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

## Deployment

The website is deployed to Azure App Service via GitHub Actions
([`.github/workflows/publish.yml`](.github/workflows/publish.yml)) on pushes to
`main` that touch `src/**`.

## License

See [LICENSE](LICENSE).
