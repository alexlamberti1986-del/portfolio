# Alex Lamberti – Multiversum Portfolio

Static site for **[alexlamberti.ch](https://www.alexlamberti.ch)** (Multiversum shell with Nexora, Professional, and Freiraum worlds).

## Deploy / Vercel

- **Vercel project root:** `app/`
- **Primary entry:** `app/index.html`
- SPA-style routes are rewritten to `/index.html` in `app/vercel.json`
- Legacy URL `/3-Welten-Master-iframe.html` permanently redirects to `/` (file itself is a minimal client redirect)

## Local preview

From `Portfolio-App/`:

```bash
npm run serve
```

Or:

```bash
npx --yes serve app -l 4173
```

Then open `http://localhost:4173`.

## Branch workflow

See **`DEVELOPMENT-WORKFLOW.md`** and **`STABLE-REFERENCE.md`** for the stable reference (22.07.2026) and release process.

- **`main`** — live production (deploy only after explicit approval)
- **`development`** — integration branch for local testing
- **`feature/*`** — single changes

Quick local preview:

```bash
npm run serve
```

Restore instructions: **`WIEDERHERSTELLUNG.md`**

## Structure

```
Portfolio-App/
  app/                 # Vercel root (static HTML/CSS/JS + assets)
    index.html         # Live entry shell
    vercel.json        # Rewrites, redirects, headers
    assets/            # Images, CSS, JS, audio/worlds
    *.html             # World pages & legal/service pages
  docs-archive/        # Audit notes, cleanup baselines, one-off scripts (not deployed)
  package.json         # Minimal helper: npm run serve
  README.md
```

Archived docs and tooling live under `docs-archive/` so they are outside the Vercel root and are not served.