import { visit } from 'unist-util-visit';

/**
 * Sibling markdown links such as `./protocol/` are correct next to files under
 * `docs/`, but pages are served at `/docs/<slug>/` (trailing slash). Browsers
 * then resolve `./protocol/` to `/docs/<slug>/protocol/` (404).
 *
 * Rewrite those relative targets to site-root docs URLs before HTML is emitted.
 *
 * @param {{ base?: string }} [options]
 */
export function rehypeDocsRelativeLinks(options = {}) {
  const base = options.base ?? '/';
  const docsRoot = `${base}docs/`.replace(/\/{2,}/g, '/');

  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href !== 'string') return;

      // ./slug, ./slug/, ./slug#hash, ./slug/#hash
      const match = href.match(/^\.\/([A-Za-z0-9._-]+)\/?(#.*)?$/);
      if (!match) return;

      const slug = match[1];
      const hash = match[2] ?? '';
      node.properties.href = `${docsRoot}${slug}/${hash}`;
    });
  };
}
