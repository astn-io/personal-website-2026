import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

const PAYLOAD_URL =
  import.meta.env.PAYLOAD_URL ??
  import.meta.env.NEXT_PUBLIC_SERVER_URL ??
  'http://localhost:3000';

const PAGE_SIZE = 10;

export type SearchRecord = {
  source: 'blog' | 'guides' | 'frontendProjects' | 'graphicDesignProjects';
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  date: string;
  status?: string;
};

export type SearchResponse = {
  results: SearchRecord[];
  totalDocs: number;
  totalPages: number;
  page: number;
};

function isPopulatedObj(v: unknown): v is { id: string; title: string } {
  return !!v && typeof v === 'object' && 'title' in v;
}

function mapDoc(doc: any, source: SearchRecord['source']): SearchRecord {
  const categories = (doc.categories ?? []).filter(isPopulatedObj);
  const tags = (doc.tags ?? []).filter(isPopulatedObj);
  return {
    source,
    slug: doc.slug ?? doc.id,
    title: doc.title ?? '',
    description: doc.description ?? '',
    category: categories[0]?.title,
    tags: tags.map((t: { title: string }) => t.title),
    date: doc.publishedAt ?? doc.createdAt,
    status: doc.status,
  };
}

// Fetch every page of a Payload collection endpoint and return all docs.
async function fetchAllDocs(endpoint: string): Promise<any[]> {
  const all: any[] = [];
  let page = 1;

  while (true) {
    const url = `${PAYLOAD_URL}/api/${endpoint}?draft=false&depth=1&limit=100&page=${page}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[search] ${endpoint} page ${page} → ${res.status}`);
        break;
      }
      const body = await res.json();
      all.push(...(body.docs ?? []));
      if (!body.hasNextPage) break;
      page++;
    } catch (err) {
      console.error(`[search] failed fetching ${endpoint}:`, err);
      break;
    }
  }

  return all;
}

// Filter pre-fetched docs by the search term across title, description, tags, and categories.
function filterDocs(
  docs: any[],
  source: SearchRecord['source'],
  term: string,
): SearchRecord[] {
  const lower = term.toLowerCase();
  return docs
    .filter((doc) => {
      const title = (doc.title ?? '').toLowerCase();
      const description = (doc.description ?? '').toLowerCase();
      const categories = ((doc.categories ?? []) as unknown[])
        .filter(isPopulatedObj)
        .map((c) => c.title.toLowerCase());
      const tags = ((doc.tags ?? []) as unknown[])
        .filter(isPopulatedObj)
        .map((t) => t.title.toLowerCase());

      return (
        title.includes(lower) ||
        description.includes(lower) ||
        categories.some((c) => c.includes(lower)) ||
        tags.some((t) => t.includes(lower))
      );
    })
    .map((doc) => mapDoc(doc, source));
}

function filterGuides(
  guides: Awaited<ReturnType<typeof getCollection<'guides'>>>,
  term: string,
): SearchRecord[] {
  const lower = term.toLowerCase();
  return guides
    .filter(({ data }) => {
      return (
        data.public !== false &&
        data.archived !== true &&
        (data.title.toLowerCase().includes(lower) ||
          data.description.toLowerCase().includes(lower) ||
          data.category?.toLowerCase().includes(lower) ||
          data.tags?.some((t) => t.toLowerCase().includes(lower)))
      );
    })
    .map(({ id, data }): SearchRecord => ({
      source: 'guides',
      slug: id,
      title: data.title,
      description: data.description,
      category: data.category,
      tags: data.tags,
      date: data.pubDate.toISOString(),
    }));
}

export const GET: APIRoute = async ({ url }) => {
  const term = url.searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10) || 1);

  if (!term) {
    return new Response(
      JSON.stringify({ results: [], totalDocs: 0, totalPages: 0, page: 1 } satisfies SearchResponse),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  const [postDocs, frontendDocs, graphicDesignDocs, allGuides] = await Promise.all([
    fetchAllDocs('posts'),
    fetchAllDocs('frontend-projects'),
    fetchAllDocs('graphic-design-projects'),
    getCollection('guides'),
  ]);

  const all = [
    ...filterDocs(postDocs, 'blog', term),
    ...filterGuides(allGuides, term),
    ...filterDocs(frontendDocs, 'frontendProjects', term),
    ...filterDocs(graphicDesignDocs, 'graphicDesignProjects', term),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
