# Documentation site (GitHub Pages)

Live URL: **https://foisalislambd.github.io/vite-basepath/**

This Vite + React app is the official docs for [vite-basepath](https://github.com/Foisalislambd/vite-basepath). It is built with the plugin itself (`base: ./`).

## Develop locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Produces `dist/` with `404.html` and `.nojekyll` for GitHub Pages.

## Test like GitHub Pages (optional)

```bash
npm run preview:pages
```

Open `http://localhost:4178` — for subpath behavior, deploy to GitHub Pages or copy `dist/` into a subfolder on any static server.

## Deploy

Deployment is automatic via [deploy-pages.yml](../.github/workflows/deploy-pages.yml) when you push to `main`.

**One-time GitHub setup:**

1. Repo **Settings → Pages**
2. **Build and deployment → Source:** `GitHub Actions`
3. Push to `main` (or run **Actions → Deploy GitHub Pages → Run workflow**)

No `base: '/vite-basepath/'` in `vite.config.ts` — the plugin handles relative assets and runtime path detection.
