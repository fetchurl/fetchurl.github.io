const modules = import.meta.glob('../../docs/*.{md,mdx}', { eager: true }) as Record<
  string,
  {
    frontmatter: { title?: string; description?: string; order?: number };
    default: unknown;
    getHeadings?: () => { depth: number; slug: string; text: string }[];
  }
>;

function pathToSlug(path: string): string {
  const base = path.split('/').pop() ?? path;
  return base.replace(/\.(md|mdx)$/, '');
}

export function getAllDocs() {
  return Object.entries(modules)
    .map(([path, mod]) => {
      const slug = pathToSlug(path);
      const fm = mod.frontmatter ?? {};
      return {
        slug,
        title: fm.title ?? slug,
        description: fm.description ?? '',
        order: fm.order ?? 99,
        Content: mod.default,
        headings: typeof mod.getHeadings === 'function' ? mod.getHeadings() : [],
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getDoc(slug: string) {
  return getAllDocs().find((d) => d.slug === slug);
}

export function getDocNav() {
  return getAllDocs().map(({ slug, title, description, order }) => ({
    slug,
    title,
    description,
    order,
  }));
}
