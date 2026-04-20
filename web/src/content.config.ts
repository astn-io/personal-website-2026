import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { Status } from '@scripts/types';
import { payloadPostsLoader } from '@/loaders/payloadPostsLoader';

/**
 * There is a collection enum in /src/scripts/types.ts
 * Please refer to that if you make any changes here
 */

const remoteImage = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string().optional(),
});

const blog = defineCollection({
  loader: payloadPostsLoader(),
  schema: z.object({
    title: z.string(),
    featured: z.boolean().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: remoteImage.optional(),
    coverAlt: z.string().optional(),
    images: z.array(remoteImage).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    archived: z.boolean().optional(),
    author: z.string().optional(),
    content: z.any(),
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

const internalLinks = defineCollection({
  loader: file('./content/internal-links/internalLinks.json'),
  schema: z.object({
    url: z.string(),
    label: z.string(),
    icon: z.string(),
  }),
});

const externalLinks = defineCollection({
  loader: file('./content/external-links/externalLinks.json'),
  schema: z.object({
    label: z.string(),
    icon: z.string(),
    links: z.array(
      z.object({
        label: z.string(),
        url: z.url(),
        icon: z.string(),
        external: z.boolean(),
        enabled: z.boolean(),
        featured: z.boolean(),
        username: z.string(),
      }),
    ),
  }),
});

export const collections = {
  blog,
  guides,
  frontendProjects,
  internalLinks,
  externalLinks,
};
