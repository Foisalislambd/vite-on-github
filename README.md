# vite-on-github

![vite-on-github banner](./assets/vite-on-github-banner.png)

[![npm version](https://img.shields.io/npm/v/vite-on-github.svg)](https://www.npmjs.com/package/vite-on-github)
[![license](https://img.shields.io/npm/l/vite-on-github.svg)](LICENSE)
[![GitHub](https://img.shields.io/github/stars/Foisalislambd/vite-on-github?style=social)](https://github.com/Foisalislambd/vite-on-github)

> **One command** to prepare any Vite project for **GitHub Pages** — auto config, base paths, CI, and router setup.

No more fighting with `base` paths, broken assets, or manual GitHub Actions YAML.

**Live demo:** [foisalislambd.github.io/vite-on-github](https://foisalislambd.github.io/vite-on-github/) (built from `/demo`)

---

## The Problem

Deploying a Vite app to GitHub Pages usually means:

- Setting the correct `base` URL (`/repo-name/` vs `/`)
- Fixing broken asset paths when the app lives in a subfolder
- Configuring React Router / Vue Router `basename`
- Writing a GitHub Actions workflow from scratch
- Adding SPA fallback (`404.html`) for client-side routing

That's a lot of steps — and easy to get wrong.

## The Solution

Run **one command** inside your Vite project:

```bash
npx vite-on-github
```

It automatically:

1. Installs [`vite-basepath`](https://www.npmjs.com/package/vite-basepath) — relative asset paths that work in **any** subfolder
2. Patches your `vite.config.ts` / `vite.config.js` to add the plugin
3. Updates React Router / Vue Router with `getBase()` when detected
4. Creates `.github/workflows/deploy.yml` for GitHub Pages
5. Adds SPA `404.html` fallback in the CI build step

Your app works at:

- `https://username.github.io/` (user site)
- `https://username.github.io/my-repo/` (project site)
- **Any nested path** — no config changes needed

---

## Quick Start

```bash
# Inside your Vite project folder
npx vite-on-github
```

Follow the prompts, then:

1. Push to GitHub
2. Go to **Settings → Pages → Build and deployment**
3. Set **Source** to **GitHub Actions**
4. Done — your site deploys on every push to `main` / `master`

---

## CLI Reference

```
vite-on-github [command] [options]

Commands:
  init          Set up everything (default)
  help          Show help

Options:
  -y, --yes           Skip prompts
  --skip-install      Don't install vite-basepath
  --skip-vite-config  Don't patch vite.config
  --skip-router       Don't patch router files
  --skip-ci           Don't create workflow
  --node <version>    Node version for CI (default: 22)
  --out-dir <dir>     Build output (default: dist)
```

### Examples

```bash
# Interactive setup
npx vite-on-github

# Non-interactive (CI / scripts)
npx vite-on-github init -y

# Custom Node version and output dir
npx vite-on-github init --node 20 --out-dir dist
```

---

## What Gets Changed

| File | Change |
|------|--------|
| `package.json` | Adds `vite-basepath` dev dependency |
| `vite.config.*` | Adds `viteBasepath()` plugin |
| `src/main.*` or router | Adds `getBase()` for React/Vue Router |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow |

Existing config is **patched**, not replaced. Safe to run again — skips what's already done.

---

## Programmatic API

Use in scripts or other tools:

```ts
import { init } from 'vite-on-github';

const result = await init({
  cwd: '/path/to/vite-project',
  yes: true,
});

console.log(result.pagesUrl); // https://user.github.io/repo/
```

---

## How Base Paths Work

This package uses **[vite-basepath](https://www.npmjs.com/package/vite-basepath)** under the hood:

- Build-time: sets Vite `base` to `./` (relative paths)
- Runtime: detects the real deploy path automatically
- Routers: `getBase()` returns the correct `basename` / `history` base

Same build works everywhere — root, subfolder, or nested path.

---

## Demo site

The `/demo` folder is a full documentation site (same design as [vite-basepath](https://github.com/Foisalislambd/vite-basepath)) adapted for **vite-on-github**. It deploys to GitHub Pages via `.github/workflows/deploy-demo.yml`.

```bash
cd demo
npm install
npm run dev      # local preview
npm run build    # production build + 404.html for Pages
```

After pushing to GitHub, enable **Settings → Pages → GitHub Actions** as the source.

---

## Requirements

- Node.js 18+
- A Vite project (`vite` in `package.json`)
- Git repository with GitHub remote (optional — for URL preview)

---

## License

MIT
