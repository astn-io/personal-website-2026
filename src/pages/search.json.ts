import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

type SearchableCollection = 'blog' | 'guides' | 'frontendProjects';

type SearchRecord = {
  source: SearchableCollection;
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  date: string;
  status?: string;
};

function isPublic(entry: CollectionEntry<SearchableCollection>) {
  const data = entry.data as { public?: boolean; archived?: boolean };
  return data.public !== false && data.archived !== true;
}

function toRecord(
  source: SearchableCollection,
  entry: CollectionEntry<SearchableCollection>,
): SearchRecord {
  const data = entry.data as {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
    pubDate: Date;
    status?: string;
  };

  return {
    source,
    slug: entry.id,
    title: data.title,
    description: data.description,
    category: data.category,
    tags: data.tags,
    date: data.pubDate.toISOString(),
    status: data.status,
  };
}

export const GET: APIRoute = async () => {
  const [blog, guides, frontendProjects] = await Promise.all([
    getCollection('blog', isPublic),
    getCollection('guides', isPublic),
    getCollection('frontendProjects', isPublic),
  ]);

  const records: SearchRecord[] = [
    ...blog.map((e) => toRecord('blog', e)),
    ...guides.map((e) => toRecord('guides', e)),
    ...frontendProjects.map((e) => toRecord('frontendProjects', e)),
  ];

  return new Response(JSON.stringify(records), {
    headers: { 'Content-Type': 'application/json' },
  });
};
