import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import Fuse, { type IFuseOptions } from 'fuse.js';

export const prerender = false;

const PAYLOAD_URL =
  import.meta.env.PAYLOAD_URL ??
  import.meta.env.NEXT_PUBLIC_SERVER_URL ??
  'http://localhost:3000';

const PAGE_SIZE = 10;

type Source = 'blog' | 'guides' | 'frontendProjects' | 'graphicDesignProjects';

export type SearchRecord = {
  source: Source;
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  date: string;
};

export type SearchResponse = {
  results: SearchRecord[];
  totalDocs: number;
  totalPages: number;
  page: number;
};

type PayloadSearchDoc = {
  id: string;
  title?: string;
  slug?: string;
  priority?: number;
  createdAt: string;
  updatedAt: string;
  meta?: {
    title?: string;
    description?: string;
  };
  categories?: { categoryID?: string; title?: string }[];
  tags?: { tagID?: string; title?: string }[];
  doc?: { relationTo?: string; value?: string };
};

const RELATION_TO_SOURCE: Record<string, Source> = {
  posts: 'blog',
  'frontend-projects': 'frontendProjects',
  'graphic-design-projects': 'graphicDesignProjects',
};

async function fetchPayloadSearchDocs(): Promise<PayloadSearchDoc[]> {
  const all: PayloadSearchDoc[] = [];
  let page = 1;

  while (true) {
    const url = `${PAYLOAD_URL}/api/search?depth=0&limit=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[search] payload search page ${page} → ${res.status}`);
        break;
      }
      const body = (await res.json()) as { docs?: PayloadSearchDoc[]; hasNextPage?: boolean };
      all.push(...(body.docs ?? []));
      if (!body.hasNextPage) break;
      page++;
    } catch (err) {
      console.error('[search] payload search fetch failed:', err);
      break;
    }
  }

  return all;
}

function mapPayloadDoc(doc: PayloadSearchDoc): SearchRecord | null {
  const relationTo = doc.doc?.relationTo;
  const source = relationTo ? RELATION_TO_SOURCE[relationTo] : undefined;
  if (!source || !doc.slug) return null;

  return {
    source,
    slug: doc.slug,
    title: doc.meta?.title || doc.title || '',
    description: doc.meta?.description ?? '',
    category: doc.categories?.[0]?.title,
    tags: (doc.tags ?? []).map((t) => t.title ?? '').filter(Boolean),
    date: doc.updatedAt ?? doc.createdAt,
  };
}

async function fetchGuideRecords(): Promise<SearchRecord[]> {
  const guides = await getCollection('guides');
  return guides
    .filter(({ data }) => data.public !== false && data.archived !== true)
    .map(({ id, data }) => ({
      source: 'guides' as const,
      slug: id,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags ?? [],
      date: data.pubDate.toISOString(),
    }));
}

const FUSE_OPTIONS: IFuseOptions<SearchRecord> = {
  includeScore: true,
  shouldSort: true,
  keys: [
    { name: 'title', weight: 0.75 },
    { name: 'description', weight: 0.5 },
    { name: 'tags', weight: 0.4 },
    { name: 'category', weight: 0.2 },
  ],
};

export const GET: APIRoute = async ({ url }) => {
  const term = url.searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);

  if (!term) {
    return new Response(
      JSON.stringify({ results: [], totalDocs: 0, totalPages: 0, page: 1 } satisfies SearchResponse),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  const [payloadDocs, guideRecords] = await Promise.all([
    fetchPayloadSearchDocs(),
    fetchGuideRecords(),
  ]);

  const records: SearchRecord[] = [
    ...payloadDocs.map(mapPayloadDoc).filter((r): r is SearchRecord => r !== null),
    ...guideRecords,
  ];

  const fuse = new Fuse(records, FUSE_OPTIONS);
  const all = fuse.search(term).map(({ item }) => item);

  const totalDocs = all.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / PAGE_SIZE));
  const clampedPage = Math.min(Math.max(1, page), totalPages);
  const start = (clampedPage - 1) * PAGE_SIZE;
  const results = all.slice(start, start + PAGE_SIZE);

  return new Response(
    JSON.stringify({ results, totalDocs, totalPages, page: clampedPage } satisfies SearchResponse),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
