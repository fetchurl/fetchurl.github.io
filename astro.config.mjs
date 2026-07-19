// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import llmsTxt from '@alexcarol/astro-llms-txt';
import { unified } from '@astrojs/markdown-remark';
import { rehypeDocsRelativeLinks } from './src/lib/rehype-docs-relative-links.mjs';

const site = 'https://fetchurl.github.io';
const base = '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [
    mdx(),
    // Generates /llms.txt and /llms-full.txt from the static build output
    llmsTxt({
      name: 'fetchurl',
      titleSource: 'h1',
      excludedPaths: ['404'],
    }),
  ],
  markdown: {
    // Astro 7: plugins go on processor (markdown.rehypePlugins is deprecated).
    processor: unified({
      rehypePlugins: [[rehypeDocsRelativeLinks, { base }]],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
