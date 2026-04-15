import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { Status } from '@scripts/types';

/**
 * There is a collection enum in /src/scripts/types.ts
 * Please refer to that if you make any changes here
 */

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      featured: z.boolean().optional(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      public: z.boolean().optional(),
      archived: z.boolean().optional(),
      author: z.string().optional(),
    }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      featured: z.boolean().optional(),
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
      featured: z.boolean().optional(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      public: z.boolean().optional(),
      archived: z.boolean().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
          }),
        )
        .optional(),
      status: z.enum(Status).optional().default(Status.unknown),
      repositoryUrl: z.url().optional(),
      demoUrl: z.url().optional(),
      frontendmentorUrl: z.url().optional(),
    }),
});

export const collections = { blog, guides, frontendProjects };
