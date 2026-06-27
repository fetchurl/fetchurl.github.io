# fetchurl.github.io

Public documentation site for the [fetchurl](https://github.com/fetchurl) organization — Astro + Tailwind CSS + daisyUI, deployed to **GitHub Pages** at the org root.

Live: **https://fetchurl.github.io**

## Stack

- [Astro](https://astro.build) (static)
- [Tailwind CSS](https://tailwindcss.com) v4 + [daisyUI](https://daisyui.com) v5
- Markdown under [`docs/`](./docs/) (rendered at `/docs/*`)
- Brand accent from the org avatar blue (`#0050d0` / OKLCH primary)
- Flat UI (`--depth: 0`) with light/dark theme chooser (`fetchurl` / `fetchurl-dark`)
- `llms.txt` and `llms-full.txt` generated at build by [`@alexcarol/astro-llms-txt`](https://www.npmjs.com/package/@alexcarol/astro-llms-txt)

## Develop

Node is provisioned via [mise](https://mise.jdx.dev) (see `mise.toml`). Use `mise exec` — do not install Node globally for this project.

```bash
mise trust   # once, if needed
mise install
mise exec -- npm install
mise exec -- npm run dev
```

## Build

```bash
mise exec -- npm run build
# output: dist/
mise exec -- npm run preview
```

## Content

Edit Markdown in `docs/` with frontmatter:

```yaml
---
title: Page title
description: Short summary
order: 1
---
```

Slugs are filenames without extension (`getting-started.md` → `/docs/getting-started/`).

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds on `main` and deploys with **GitHub Pages** (Actions source).

Org site requires repository name **`fetchurl.github.io`**. Pages source: GitHub Actions.

`astro.config.mjs` sets `site: 'https://fetchurl.github.io'` and `base: '/'`.

## License

Site content and code: MIT (aligned with org projects), unless noted otherwise in linked repositories.
