import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { frontendProject1 } from './frontend-project-1'
import { frontendProject2 } from './frontend-project-2'
import { graphicDesignProject1 } from './graphic-design-project-1'
import { graphicDesignProject2 } from './graphic-design-project-2'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const seedDir = path.dirname(fileURLToPath(import.meta.url))

const collectionsToClear: CollectionSlug[] = [
  'posts',
  'frontend-projects',
  'graphic-design-projects',
  'categories',
  'tags',
  'media',
  'search',
  'redirects',
]

const categoryTitles = ['Technology', 'Design', 'Software', 'Engineering', 'Writing', 'Personal']
const tagTitles = ['Astro', 'Svelte', 'Payload', 'TypeScript', 'Identity', 'Print']

const pickBySlug = <T extends { slug?: string | null }>(docs: T[], slug: string): T => {
  const match = docs.find((d) => d.slug === slug)
  if (!match) throw new Error(`Seed: could not find doc with slug "${slug}"`)
  return match
}

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info('— Clearing collections...')
  await Promise.all(
    collectionsToClear
      .filter((slug) => Boolean(payload.collections[slug]))
      .map((slug) => payload.db.deleteMany({ collection: slug, req, where: {} })),
  )
  await Promise.all(
    collectionsToClear
      .filter((slug) => Boolean(payload.collections[slug]?.config.versions))
      .map((slug) => payload.db.deleteVersions({ collection: slug, req, where: {} })),
  )

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'demo-author@example.com' } },
  })

  payload.logger.info('— Seeding demo user, taxonomies, and media...')
  const [demoAuthor, categoryDocs, tagDocs] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    Promise.all(
      categoryTitles.map((title) =>
        payload.create({
          collection: 'categories',
          data: { title, slug: title.toLowerCase() },
        }),
      ),
    ),
    Promise.all(
      tagTitles.map((title) =>
        payload.create({
          collection: 'tags',
          data: { title, slug: title.toLowerCase() },
        }),
      ),
    ),
  ])

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    readLocalFile('image-post1.webp'),
    readLocalFile('image-post2.webp'),
    readLocalFile('image-post3.webp'),
    readLocalFile('image-hero1.webp'),
  ])

  const [image1Doc, image2Doc, image3Doc, heroImageDoc] = await Promise.all([
    payload.create({ collection: 'media', data: image1, file: image1Buffer }),
    payload.create({ collection: 'media', data: image2, file: image2Buffer }),
    payload.create({ collection: 'media', data: image2, file: image3Buffer }),
    payload.create({ collection: 'media', data: imageHero1, file: hero1Buffer }),
  ])

  const categoryBySlug = (slug: string) => pickBySlug(categoryDocs, slug).id
  const tagBySlug = (slug: string) => pickBySlug(tagDocs, slug).id

  payload.logger.info('— Seeding posts...')
  // Sequential so createdAt ordering is stable across runs.
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post1({ heroImage: heroImageDoc, blockImage: image1Doc, author: demoAuthor }),
      categories: [categoryBySlug('technology')],
      tags: [tagBySlug('typescript'), tagBySlug('svelte')],
      featured: true,
    },
  })
  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
      categories: [categoryBySlug('writing')],
      tags: [tagBySlug('astro')],
    },
  })
  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
      categories: [categoryBySlug('personal')],
      tags: [tagBySlug('payload')],
    },
  })

  await Promise.all([
    payload.update({
      id: post1Doc.id,
      collection: 'posts',
      data: { relatedPosts: [post2Doc.id, post3Doc.id] },
    }),
    payload.update({
      id: post2Doc.id,
      collection: 'posts',
      data: { relatedPosts: [post1Doc.id, post3Doc.id] },
    }),
    payload.update({
      id: post3Doc.id,
      collection: 'posts',
      data: { relatedPosts: [post1Doc.id, post2Doc.id] },
    }),
  ])

  payload.logger.info('— Seeding frontend projects...')
  const frontendProject1Doc = await payload.create({
    collection: 'frontend-projects',
    depth: 0,
    data: {
      ...frontendProject1({ heroImage: heroImageDoc, blockImage: image2Doc }),
      categories: [categoryBySlug('software')],
      tags: [tagBySlug('svelte'), tagBySlug('typescript')],
      featured: true,
    },
  })
  const frontendProject2Doc = await payload.create({
    collection: 'frontend-projects',
    depth: 0,
    data: {
      ...frontendProject2({ heroImage: image1Doc, blockImage: image3Doc }),
      categories: [categoryBySlug('engineering')],
      tags: [tagBySlug('astro'), tagBySlug('typescript')],
    },
  })

  await Promise.all([
    payload.update({
      id: frontendProject1Doc.id,
      collection: 'frontend-projects',
      data: { relatedProjects: [frontendProject2Doc.id] },
    }),
    payload.update({
      id: frontendProject2Doc.id,
      collection: 'frontend-projects',
      data: { relatedProjects: [frontendProject1Doc.id] },
    }),
  ])

  payload.logger.info('— Seeding graphic design projects...')
  const graphicProject1Doc = await payload.create({
    collection: 'graphic-design-projects',
    depth: 0,
    data: {
      ...graphicDesignProject1({ heroImage: image2Doc, blockImage: heroImageDoc }),
      categories: [categoryBySlug('design')],
      tags: [tagBySlug('identity')],
      featured: true,
    },
  })
  const graphicProject2Doc = await payload.create({
    collection: 'graphic-design-projects',
    depth: 0,
    data: {
      ...graphicDesignProject2({ heroImage: image3Doc, blockImage: image1Doc }),
      categories: [categoryBySlug('design')],
      tags: [tagBySlug('print')],
    },
  })

  await Promise.all([
    payload.update({
      id: graphicProject1Doc.id,
      collection: 'graphic-design-projects',
      data: { relatedProjects: [graphicProject2Doc.id] },
    }),
    payload.update({
      id: graphicProject2Doc.id,
      collection: 'graphic-design-projects',
      data: { relatedProjects: [graphicProject1Doc.id] },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function readLocalFile(filename: string): Promise<File> {
  const fullPath = path.join(seedDir, filename)
  const data = await fs.readFile(fullPath)
  return {
    name: filename,
    data,
    mimetype: `image/${path.extname(filename).slice(1)}`,
    size: data.byteLength,
  }
}
