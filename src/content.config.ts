import { defineCollection } from 'astro:content';
import { Status } from '@scripts/types';

import { glob } from 'astro/loaders';

import { z } from 'astro/zod';

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
      topic: z.string().optional(),
      tags: z.array(z.string()).optional(),
      public: z.boolean().optional(),
      archived: z.boolean().optional(),
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
      public: z.boolean().optional(),
      archived: z.boolean().optional(),
      images: z.array(image()).optional(),
      status: z.enum(Status).optional(),
      repositoryUrl: z.url().optional(),
      demoUrl: z.url().optional(),
      frontendmentorUrl: z.url().optional(),
    }),
});

export const collections = { blog, frontendProjects };
