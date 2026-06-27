# fetchurl website

Public documentation site for the [fetchurl](https://github.com/fetchurl) organization — Astro + Tailwind CSS + daisyUI, deployed to **GitHub Pages**.

Live (once Pages is enabled): **https://fetchurl.github.io/website/**

## Stack

- [Astro](https://astro.build) (static)
- [Tailwind CSS](https://tailwindcss.com) v4 + [daisyUI](https://daisyui.com) v5
- Markdown under [`docs/`](./docs/) (rendered at `/docs/*`)
- Brand accent from the org avatar blue (`#0050d0` / OKLCH primary)
- Flat UI (`--depth: 0`) with light/dark theme chooser (`fetchurl` / `fetchurl-dark`)
- [`public/llms.txt`](./public/llms.txt) for LLM-oriented project summary

## Develop

Node is provisioned via [mise](https://mise.jdx.dev) (see `mise.toml`). Do not rely on a global Node install.

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

1. Repo: [fetchurl/website](https://github.com/fetchurl/website) (this one).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions** (enabled via API on create).
3. Push `main` — workflow uploads `dist/` and deploys.

Project URL: `https://fetchurl.github.io/website/` (`base: '/website/'` in `astro.config.mjs`).
For an org root site at `https://fetchurl.github.io/`, rename the repo to `fetchurl.github.io` and set `base: '/'`.

## License

Site content and code: MIT (aligned with org projects), unless noted otherwise in linked repositories.
