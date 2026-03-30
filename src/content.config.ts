// 1. Import utilities from `astro:content`
import { defineCollection } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Import Zod
import { z } from 'astro/zod';

// 4. Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
});

const frontendProjects = defineCollection({
  loader: glob({
    base: './src/content/projects/frontend',
    pattern: '**/*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      images: z.array(image()).optional(),
      status: z.enum(['complete', 'incomplete', 'cancelled']).optional(),
    }),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { blog };
