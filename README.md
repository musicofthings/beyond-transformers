# Beyond Transformers

An interactive educational atlas of alternative architectures for large language models, with three switchable visual themes (Architecture Atlas, Field Guide, Efficiency Lab).

**Live site:** [musicofthings.github.io/beyond-transformers](https://musicofthings.github.io/beyond-transformers/)  
**Repository:** [github.com/musicofthings/beyond-transformers](https://github.com/musicofthings/beyond-transformers)

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Typecheck + production build into `dist/` |
| `npm run preview` | Serve the production build locally |

## Publish on GitHub Pages

The repo includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually via **Actions**).
3. The workflow runs `npm ci`, `npm run build`, and deploys `dist/`.

The Vite `base` path is relative (`./`), so the site works for project Pages under `/beyond-transformers/` and for local preview.

## Project layout

```
src/
  App.tsx                 # Page composition and interaction
  data/architectures.ts   # Typed architecture catalog and helpers
  components/Glyph.tsx    # Decorative architecture icons
  hooks/usePersistedTheme.ts
  styles.css
public/
  favicon.svg
```

## Notes

- Theme choice is stored in `localStorage` (`beyond-transformers-theme`).
- Efficiency lab numbers are **illustrative asymptotics**, not hardware benchmarks.
- Compare-table cells are architecture-level tendencies; see the on-page sources section for primary papers.
