import type {
  CollectionSlug,
  File,
  Payload,
  PayloadRequest,
  RequiredDataFromCollectionSlug,
} from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Media } from '@/payload-types'

import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import {
  graphicDesignProjectSeeds,
  type GraphicDesignProjectSeed,
} from './graphic-design-projects-data'
import { markdownToLexicalNodes, mediaBlockNode, wrapRoot } from './utils/lexical'
import {
  readFrontendProjects,
  readMasonryMockups,
  type ParsedProject,
} from './utils/readContentProjects'

const seedDir = path.dirname(fileURLToPath(import.meta.url))
const repoContentDir = path.resolve(seedDir, '../../../..', 'content')

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

// Seed categories/tags for posts, merged with whatever the content folder needs.
const postCategoryTitles = ['Technology', 'Design', 'Software', 'Engineering', 'Writing', 'Personal']
const postTagTitles = ['Astro', 'Svelte', 'Payload', 'TypeScript', 'Identity', 'Print']

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const isTransientMongoError = (err: unknown): boolean => {
  const msg = err instanceof Error ? err.message : String(err)
  return /connection .* closed|MongoNetworkError|ECONNRESET|topology|server selection/i.test(msg)
}

/**
 * Retries an operation up to `attempts` times when it throws a transient Mongo
 * connection error. Local mongod under bursty writes occasionally drops
 * connections; one short retry is almost always enough to recover.
 */
const withMongoRetry = async <T>(label: string, op: () => Promise<T>, attempts = 3): Promise<T> => {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await op()
    } catch (err) {
      lastErr = err
      if (!isTransientMongoError(err) || i === attempts - 1) throw err
      await new Promise((resolve) => setTimeout(resolve, 250 * (i + 1)))
    }
  }
  throw lastErr
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
  for (const slug of collectionsToClear) {
    if (!payload.collections[slug]) continue
    await payload.db.deleteMany({ collection: slug, req, where: {} })
    if (payload.collections[slug]?.config.versions) {
      await payload.db.deleteVersions({ collection: slug, req, where: {} })
    }
  }

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'demo-author@example.com' } },
  })

  payload.logger.info(`— Reading content from ${repoContentDir}`)
  const [frontendProjects, masonryMockups] = await Promise.all([
    readFrontendProjects(repoContentDir, (msg) => payload.logger.warn(msg)),
    readMasonryMockups(repoContentDir, (msg) => payload.logger.warn(msg)),
  ])
  payload.logger.info(
    `— Parsed ${frontendProjects.length} frontend projects and ${masonryMockups.length} mockups`,
  )

  if (masonryMockups.length < graphicDesignProjectSeeds.length) {
    payload.logger.warn(
      `Only ${masonryMockups.length} mockup images for ${graphicDesignProjectSeeds.length} graphic design seeds — extras will be skipped.`,
    )
  }

  const allCategoryTitles = uniqueBy(
    [
      ...postCategoryTitles,
      ...frontendProjects.map((p) => p.category),
      ...graphicDesignProjectSeeds.map((g) => g.category),
    ],
    (title) => slugify(title),
  )

  const allTagTitles = uniqueBy(
    [
      ...postTagTitles,
      ...frontendProjects.flatMap((p) => p.tags),
      ...graphicDesignProjectSeeds.flatMap((g) => g.tags),
    ],
    (title) => slugify(title),
  )

  payload.logger.info(
    `— Seeding demo user, ${allCategoryTitles.length} categories, ${allTagTitles.length} tags...`,
  )
  // Sequential to avoid swamping the Mongo connection pool on local dev,
  // which silently kills connections under sudden bursts of parallel writes.
  const demoAuthor = await withMongoRetry('demo author', () =>
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
  )

  const categoryIdBySlug = new Map<string, string>()
  for (const title of allCategoryTitles) {
    const doc = await withMongoRetry(`category ${title}`, () =>
      payload.create({
        collection: 'categories',
        data: { title, slug: slugify(title) },
      }),
    )
    categoryIdBySlug.set(doc.slug ?? slugify(title), doc.id)
  }

  const tagIdBySlug = new Map<string, string>()
  for (const title of allTagTitles) {
    const doc = await withMongoRetry(`tag ${title}`, () =>
      payload.create({
        collection: 'tags',
        data: { title, slug: slugify(title) },
      }),
    )
    tagIdBySlug.set(doc.slug ?? slugify(title), doc.id)
  }

  const categoryId = (title: string): string => {
    const id = categoryIdBySlug.get(slugify(title))
    if (id === undefined) throw new Error(`Missing seeded category "${title}"`)
    return id
  }
  const tagId = (title: string): string => {
    const id = tagIdBySlug.get(slugify(title))
    if (id === undefined) throw new Error(`Missing seeded tag "${title}"`)
    return id
  }

  // Pre-existing webp art used for the sample posts. Disk reads stay parallel
  // (cheap), but the media creates are sequential to keep Mongo's connection
  // pool calm — sharp generates several derivatives per upload.
  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    readLocalFile('image-post1.webp'),
    readLocalFile('image-post2.webp'),
    readLocalFile('image-post3.webp'),
    readLocalFile('image-hero1.webp'),
  ])

  const image1Doc = await payload.create({ collection: 'media', data: image1, file: image1Buffer })
  const image2Doc = await payload.create({ collection: 'media', data: image2, file: image2Buffer })
  const image3Doc = await payload.create({ collection: 'media', data: image2, file: image3Buffer })
  const heroImageDoc = await payload.create({
    collection: 'media',
    data: imageHero1,
    file: hero1Buffer,
  })

  payload.logger.info('— Seeding posts...')
  // Sequential so createdAt ordering is stable across runs.
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post1({ heroImage: heroImageDoc, blockImage: image1Doc, author: demoAuthor }),
      categories: [categoryId('Technology')],
      tags: [tagId('TypeScript'), tagId('Svelte')],
      featured: true,
    },
  })
  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
      categories: [categoryId('Writing')],
      tags: [tagId('Astro')],
    },
  })
  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      ...post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
      categories: [categoryId('Personal')],
      tags: [tagId('Payload')],
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

  payload.logger.info(`— Seeding ${frontendProjects.length} frontend projects...`)
  const frontendProjectIds: string[] = []
  for (let i = 0; i < frontendProjects.length; i++) {
    const project = frontendProjects[i]
    payload.logger.info(`  [${i + 1}/${frontendProjects.length}] ${project.slug}`)
    try {
      const heroMedia = await withMongoRetry(`${project.slug} hero`, () =>
        payload.create({
          collection: 'media',
          data: { alt: project.coverAlt },
          file: project.coverImage,
        }),
      )
      const extraMedia: Media[] = []
      for (const buffer of project.extraImages) {
        try {
          extraMedia.push(
            await withMongoRetry(`${project.slug} extra ${buffer.name}`, () =>
              payload.create({
                collection: 'media',
                data: { alt: `${project.title} preview` },
                file: buffer,
              }),
            ),
          )
        } catch (err) {
          payload.logger.warn(
            `     extra image upload failed (${buffer.name}): ${(err as Error).message}`,
          )
        }
      }

      const created = await withMongoRetry(`${project.slug} doc`, () =>
        payload.create({
          collection: 'frontend-projects',
          depth: 0,
          data: buildFrontendProjectData({
            project,
            heroMedia,
            extraMedia,
            categoryId,
            tagId,
          }),
        }),
      )
      frontendProjectIds.push(created.id)
    } catch (err) {
      payload.logger.error(
        `     failed to seed "${project.slug}": ${(err as Error).message} — skipping`,
      )
    }
  }

  // Self-link each frontend project to two siblings. Sequential to keep the
  // Mongo connection pool quiet after the image-heavy create phase.
  for (let i = 0; i < frontendProjectIds.length; i++) {
    try {
      await payload.update({
        id: frontendProjectIds[i],
        collection: 'frontend-projects',
        data: { relatedProjects: pickSiblings(frontendProjectIds, i, 2) },
      })
    } catch (err) {
      payload.logger.warn(`  relatedProjects link failed for ${frontendProjectIds[i]}: ${(err as Error).message}`)
    }
  }

  payload.logger.info(`— Seeding ${graphicDesignProjectSeeds.length} graphic design projects...`)
  const graphicProjectIds: string[] = []
  const graphicSeeds = graphicDesignProjectSeeds.slice(0, masonryMockups.length)
  for (let i = 0; i < graphicSeeds.length; i++) {
    const seed = graphicSeeds[i]
    payload.logger.info(`  [${i + 1}/${graphicSeeds.length}] ${seed.slug}`)
    try {
      const hero = await withMongoRetry(`${seed.slug} hero`, () =>
        payload.create({
          collection: 'media',
          data: { alt: `${seed.title} cover` },
          file: masonryMockups[i],
        }),
      )

      const created = await withMongoRetry(`${seed.slug} doc`, () =>
        payload.create({
          collection: 'graphic-design-projects',
          depth: 0,
          data: buildGraphicDesignProjectData({ seed, heroMedia: hero, categoryId, tagId }),
        }),
      )
      graphicProjectIds.push(created.id)
    } catch (err) {
      payload.logger.error(
        `     failed to seed "${seed.slug}": ${(err as Error).message} — skipping`,
      )
    }
  }

  for (let i = 0; i < graphicProjectIds.length; i++) {
    try {
      await payload.update({
        id: graphicProjectIds[i],
        collection: 'graphic-design-projects',
        data: { relatedProjects: pickSiblings(graphicProjectIds, i, 2) },
      })
    } catch (err) {
      payload.logger.warn(`  relatedProjects link failed for ${graphicProjectIds[i]}: ${(err as Error).message}`)
    }
  }

  payload.logger.info('Seeded database successfully!')
}

const buildFrontendProjectData = ({
  project,
  heroMedia,
  extraMedia,
  categoryId,
  tagId,
}: {
  project: ParsedProject
  heroMedia: Media
  extraMedia: Media[]
  categoryId: (title: string) => string
  tagId: (title: string) => string
}): RequiredDataFromCollectionSlug<'frontend-projects'> => {
  const bodyNodes = markdownToLexicalNodes(project.body)
  bodyNodes.push(mediaBlockNode(heroMedia.id))

  return {
    slug: project.slug,
    _status: 'published',
    title: project.title,
    description: project.description,
    status: project.status,
    featured: project.featured,
    repositoryUrl: project.repositoryUrl,
    demoUrl: project.demoUrl,
    frontendmentorUrl: project.frontendmentorUrl,
    heroImage: heroMedia.id,
    images: [heroMedia.id, ...extraMedia.map((m) => m.id)],
    content: wrapRoot(bodyNodes) as RequiredDataFromCollectionSlug<'frontend-projects'>['content'],
    categories: [categoryId(project.category)],
    tags: project.tags.map(tagId),
    publishedAt: project.pubDate ?? undefined,
    meta: {
      title: project.title,
      description: project.description,
      image: heroMedia.id,
    },
    relatedProjects: [],
  }
}

const buildGraphicDesignProjectData = ({
  seed,
  heroMedia,
  categoryId,
  tagId,
}: {
  seed: GraphicDesignProjectSeed
  heroMedia: Media
  categoryId: (title: string) => string
  tagId: (title: string) => string
}): RequiredDataFromCollectionSlug<'graphic-design-projects'> => {
  const body = [
    ...markdownToLexicalNodes(
      `## Overview\n\n${seed.overview}\n\n## Highlights\n\n${seed.highlights
        .map((h) => `- ${h}`)
        .join('\n')}`,
    ),
    mediaBlockNode(heroMedia.id),
  ]

  return {
    slug: seed.slug,
    _status: 'published',
    title: seed.title,
    description: seed.description,
    status: seed.status,
    featured: seed.featured ?? false,
    demoUrl: seed.demoUrl,
    heroImage: heroMedia.id,
    images: [heroMedia.id],
    content: wrapRoot(body) as RequiredDataFromCollectionSlug<'graphic-design-projects'>['content'],
    categories: [categoryId(seed.category)],
    tags: seed.tags.map(tagId),
    meta: {
      title: seed.title,
      description: seed.description,
      image: heroMedia.id,
    },
    relatedProjects: [],
  }
}

const pickSiblings = <T>(ids: T[], currentIndex: number, count: number): T[] => {
  if (ids.length <= 1) return []
  const out: T[] = []
  let offset = 1
  while (out.length < count && out.length < ids.length - 1) {
    out.push(ids[(currentIndex + offset) % ids.length])
    offset++
  }
  return out
}

const uniqueBy = <T, K>(items: T[], key: (item: T) => K): T[] => {
  const seen = new Set<K>()
  const out: T[] = []
  for (const item of items) {
    const k = key(item)
    if (!seen.has(k)) {
      seen.add(k)
      out.push(item)
    }
  }
  return out
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
