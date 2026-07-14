# Beyond Transformers

An interactive educational atlas of alternative architectures for large language models, with three switchable visual themes.

## Run locally

```bash
npm install
npm run dev
```

## Publish on GitHub Pages

1. Create a new GitHub repository and upload everything in this folder.
2. Commit the generated `package-lock.json` after running `npm install`.
3. In **Settings → Pages**, choose **GitHub Actions** as the source.
4. Push to the `main` branch. The included workflow builds and publishes the site automatically.

The Vite base path is relative, so the site works for both account-level Pages and repository subpaths.
