import type { Loader } from 'astro/loaders';

type PayloadMedia = {
  id: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  filename?: string;
};

type PayloadCategory = { id: string; title: string; slug: string };
type PayloadTag = { id: string; title: string; slug: string };

type PayloadFrontendProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  featured?: boolean;
  archived?: boolean;
  heroImage?: PayloadMedia | string | null;
  images?: PayloadMedia[] | string[] | null;
  content: unknown;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  categories?: PayloadCategory[] | string[];
  tags?: PayloadTag[] | string[];
  status?: 'released' | 'developing' | 'closed' | 'unknown';
  repositoryUrl?: string;
  demoUrl?: string;
  frontendmentorUrl?: string;
  _status?: 'draft' | 'published';
};

type PayloadResponse<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
};

function isPopulated<T extends { id: string }>(
  value: T | string | null | undefined,
): value is T {
  return !!value && typeof value === 'object';
}

function toAbsoluteUrl(baseUrl: string, maybeUrl?: string): string | undefined {
  if (!maybeUrl) return undefined;
  if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) {
    return maybeUrl;
  }
  return new URL(maybeUrl, baseUrl).toString();
}

function mapProject(project: PayloadFrontendProject, baseUrl: string) {
  const heroImage = isPopulated(project.heroImage) ? project.heroImage : undefined;
  const coverUrl = toAbsoluteUrl(baseUrl, heroImage?.url);

  const categories = (project.categories ?? []).filter(isPopulated);
  const tags = (project.tags ?? []).filter(isPopulated);

  const imagesData = (project.images ?? [])
    .filter(isPopulated)
    .flatMap((img) => {
      const url = toAbsoluteUrl(baseUrl, img.url);
      if (!url || !img.width || !img.height) return [];
      return [{ url, width: img.width, height: img.height, alt: img.alt ?? '' }];
    });

  return {
    title: project.title,
    description: project.description,
    featured: project.featured ?? false,
    pubDate: project.publishedAt ?? project.createdAt,
    updatedDate: project.updatedAt,
    coverImage:
      coverUrl && heroImage?.width && heroImage?.height
        ? {
            url: coverUrl,
            width: heroImage.width,
            height: heroImage.height,
            alt: heroImage.alt ?? '',
          }
        : undefined,
    coverAlt: heroImage?.alt,
    category: categories[0]?.title,
    tags: tags.map((t) => t.title),
    images: imagesData.length > 0 ? imagesData : undefined,
    archived: project.archived ?? false,
    status: project.status ?? 'unknown',
    repositoryUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
    frontendmentorUrl: project.frontendmentorUrl,
    content: project.content,
  };
}

type LoaderOptions = {
  url?: string;
  limit?: number;
};

export function payloadFrontendProjectsLoader(options: LoaderOptions = {}): Loader {
  const baseUrl =
    options.url ??
    process.env.PAYLOAD_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    'http://localhost:3000';
  const pageSize = options.limit ?? 100;

  return {
    name: 'payload-frontend-projects-loader',
    load: async ({ store, parseData, logger }) => {
      store.clear();

      let page = 1;
      let hasNext = true;
      let total = 0;

      try {
        while (hasNext) {
          const endpoint = new URL('/api/frontend-projects', baseUrl);
          endpoint.searchParams.set('depth', '2');
          endpoint.searchParams.set('limit', String(pageSize));
          endpoint.searchParams.set('page', String(page));
          endpoint.searchParams.set('draft', 'false');
          endpoint.searchParams.set('sort', '-publishedAt');

          const res = await fetch(endpoint);
          if (!res.ok) {
            throw new Error(
              `Payload frontend projects fetch failed: ${res.status} ${res.statusText} (${endpoint})`,
            );
          }

          const body = (await res.json()) as PayloadResponse<PayloadFrontendProject>;

          for (const doc of body.docs) {
            const id = doc.slug ?? doc.id;
            const mapped = mapProject(doc, baseUrl);
            const data = await parseData({ id, data: mapped });
            store.set({ id, data });
            total += 1;
          }

          hasNext = body.hasNextPage;
          page += 1;
        }

        logger.info(`Loaded ${total} frontend projects from Payload at ${baseUrl}`);
      } catch (err) {
        logger.warn(
          `Payload frontend projects loader failed (${baseUrl}): ${err instanceof Error ? err.message : String(err)}. Proceeding with an empty frontend projects collection.`,
        );
      }
    },
  };
}
