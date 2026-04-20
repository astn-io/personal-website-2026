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
type PayloadAuthor = { id: string; name?: string; email?: string };
type PayloadPopulatedAuthor = { id?: string; name?: string };

type PayloadPost = {
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
  authors?: PayloadAuthor[] | string[];
  populatedAuthors?: PayloadPopulatedAuthor[];
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

function mapPost(post: PayloadPost, baseUrl: string) {
  const heroImage = isPopulated(post.heroImage) ? post.heroImage : undefined;
  const coverUrl = toAbsoluteUrl(baseUrl, heroImage?.url);

  const categories = (post.categories ?? []).filter(isPopulated);
  const tags = (post.tags ?? []).filter(isPopulated);
  const authors = (post.authors ?? []).filter(isPopulated);

  const imagesData = (post.images ?? [])
    .filter(isPopulated)
    .flatMap((img) => {
      const url = toAbsoluteUrl(baseUrl, img.url);
      if (!url || !img.width || !img.height) return [];
      return [{ url, width: img.width, height: img.height, alt: img.alt ?? '' }];
    });

  const authorName =
    post.populatedAuthors?.[0]?.name ??
    authors[0]?.name ??
    authors[0]?.email;

  return {
    title: post.title,
    description: post.description,
    featured: post.featured ?? false,
    pubDate: post.publishedAt ?? post.createdAt,
    updatedDate: post.updatedAt,
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
    archived: post.archived ?? false,
    author: authorName,
    content: post.content,
  };
}

type LoaderOptions = {
  url?: string;
  limit?: number;
};

export function payloadPostsLoader(options: LoaderOptions = {}): Loader {
  const baseUrl =
    options.url ??
    process.env.PAYLOAD_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    'http://localhost:3000';
  const pageSize = options.limit ?? 100;

  return {
    name: 'payload-posts-loader',
    load: async ({ store, parseData, logger }) => {
      store.clear();

      let page = 1;
      let hasNext = true;
      let total = 0;

      try {
        while (hasNext) {
          const endpoint = new URL('/api/posts', baseUrl);
          endpoint.searchParams.set('depth', '2');
          endpoint.searchParams.set('limit', String(pageSize));
          endpoint.searchParams.set('page', String(page));
          endpoint.searchParams.set('draft', 'false');
          endpoint.searchParams.set('sort', '-publishedAt');

          const res = await fetch(endpoint);
          if (!res.ok) {
            throw new Error(
              `Payload posts fetch failed: ${res.status} ${res.statusText} (${endpoint})`,
            );
          }

          const body = (await res.json()) as PayloadResponse<PayloadPost>;

          for (const doc of body.docs) {
            const id = doc.slug ?? doc.id;
            const mapped = mapPost(doc, baseUrl);
            const data = await parseData({ id, data: mapped });
            store.set({ id, data });
            total += 1;
          }

          hasNext = body.hasNextPage;
          page += 1;
        }

        logger.info(`Loaded ${total} posts from Payload at ${baseUrl}`);
      } catch (err) {
        logger.warn(
          `Payload posts loader failed (${baseUrl}): ${err instanceof Error ? err.message : String(err)}. Proceeding with an empty blog collection.`,
        );
      }
    },
  };
}
