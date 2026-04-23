import { getCollection } from 'astro:content';

export async function getCategories(
  collection: 'blog' | 'frontendProjects' | 'graphicDesignProjects' | 'guides',
) {
  const allPosts = await getCollection(collection);

  const categoryCounts = allPosts.reduce<Record<string, number>>(
    (acc, post) => {
      const category = post.data.category;
      if (category) acc[category] = (acc[category] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const categories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  return categories;
}

export async function getTags(
  collection: 'blog' | 'frontendProjects' | 'graphicDesignProjects' | 'guides',
) {
  const allPosts = await getCollection(collection);

  const tagCounts = allPosts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.data.tags ?? []) {
      acc[tag] = (acc[tag] ?? 0) + 1;
    }
    return acc;
  }, {});

  const tags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  return tags;
}
