import type { File } from 'payload'
import fs from 'node:fs/promises'
import path from 'node:path'

export type FrontendProjectStatus = 'released' | 'developing' | 'closed' | 'unknown'

export interface ParsedProject {
  slug: string
  title: string
  description: string
  status: FrontendProjectStatus
  category: string
  tags: string[]
  featured: boolean
  pubDate?: string
  repositoryUrl?: string
  demoUrl?: string
  frontendmentorUrl?: string
  coverImage: File
  coverAlt: string
  extraImages: File[]
  body: string
}

/**
 * Reads every immediate subdirectory of `content/projects/frontend` and returns
 * the parsed project frontmatter, body, and uploaded-file buffers for the cover
 * image (plus any `images:` entries). Subdirectories without an `index.md` are
 * skipped with a warning so a malformed folder won't break the seed.
 */
export const readFrontendProjects = async (
  rootDir: string,
  log: (msg: string) => void,
): Promise<ParsedProject[]> => {
  const projectsDir = path.join(rootDir, 'projects', 'frontend')
  const entries = await fs.readdir(projectsDir, { withFileTypes: true })
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)

  const parsed: ParsedProject[] = []
  for (const slug of dirs) {
    try {
      parsed.push(await parseProject(path.join(projectsDir, slug), slug))
    } catch (err) {
      log(`Skipping project "${slug}": ${(err as Error).message}`)
    }
  }
  return parsed
}

const parseProject = async (dir: string, slug: string): Promise<ParsedProject> => {
  const markdownPath = path.join(dir, 'index.md')
  const raw = await fs.readFile(markdownPath, 'utf8')

  const { data, body } = splitFrontmatter(raw)

  const title = requireString(data, 'title')
  const description = requireString(data, 'description')
  const coverImageRel = requireString(data, 'coverImage')
  const coverAlt = stringOr(data, 'coverAlt', title)

  const coverImage = await readLocalFileRelative(dir, coverImageRel)
  const extraImages = await readExtraImages(dir, data.images)

  return {
    slug,
    title,
    description,
    status: toStatus(data.status),
    category: stringOr(data, 'category', 'Uncategorized'),
    tags: toStringArray(data.tags),
    featured: data.featured === true || data.featured === 'true',
    pubDate: typeof data.pubDate === 'string' ? data.pubDate : undefined,
    repositoryUrl: optionalString(data, 'repositoryUrl'),
    demoUrl: optionalString(data, 'demoUrl'),
    frontendmentorUrl: optionalString(data, 'frontendmentorUrl'),
    coverImage,
    coverAlt,
    extraImages,
    body,
  }
}

export const readMasonryMockups = async (
  rootDir: string,
  log: (msg: string) => void,
): Promise<File[]> => {
  const dir = path.join(rootDir, 'masonry-mockups')
  const files = (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort()
  const buffers: File[] = []
  for (const name of files) {
    try {
      buffers.push(await readLocalFileRelative(dir, name))
    } catch (err) {
      log(`Skipping mockup "${name}": ${(err as Error).message}`)
    }
  }
  return buffers
}

const readLocalFileRelative = async (baseDir: string, relative: string): Promise<File> => {
  const normalized = relative.replace(/^\.\//, '')
  const fullPath = path.join(baseDir, normalized)
  const data = await fs.readFile(fullPath)
  const name = path.basename(fullPath)
  const ext = path.extname(name).slice(1).toLowerCase()
  const mimetype = ext === 'jpg' ? 'image/jpeg' : `image/${ext || 'octet-stream'}`
  return { name, data, mimetype, size: data.byteLength }
}

const readExtraImages = async (
  baseDir: string,
  raw: unknown,
): Promise<File[]> => {
  if (!Array.isArray(raw)) return []
  const out: File[] = []
  for (const entry of raw) {
    if (entry && typeof entry === 'object' && 'src' in entry && typeof entry.src === 'string') {
      try {
        out.push(await readLocalFileRelative(baseDir, entry.src))
      } catch {
        // missing images are non-fatal for seed data
      }
    }
  }
  return out
}

const splitFrontmatter = (raw: string): { data: Record<string, unknown>; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: raw }
  return { data: parseYamlish(match[1]), body: match[2].trim() }
}

/**
 * Minimal YAML-ish parser tuned for the frontmatter shapes used in the content/
 * folder: scalars, quoted strings, `[a, b, c]` flow arrays, single-line block
 * sequences, and `[{ src: '...', alt: '...' }]` inline object arrays.
 * Enough to round-trip the existing project index.md files.
 */
const parseYamlish = (src: string): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  const lines = src.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    i++
    if (!line.trim() || line.trim().startsWith('#')) continue

    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1]
    let rest = kv[2]

    // Inline array across multiple indented lines (images: \n  [ ... ])
    if (rest === '' || rest === '[') {
      const collected: string[] = rest === '[' ? ['['] : []
      while (i < lines.length) {
        const peek = lines[i]
        if (/^\S/.test(peek) && !peek.startsWith(' ')) break
        collected.push(peek)
        i++
        if (peek.includes(']')) break
      }
      rest = collected.join('\n').trim()
      if (!rest) continue
    }

    out[key] = parseScalar(rest)
  }
  return out
}

const parseScalar = (raw: string): unknown => {
  const value = raw.trim()
  if (value === '') return ''
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null' || value === '~') return null
  if (/^-?\d+$/.test(value)) return Number(value)

  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1)
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    return parseFlowArray(value)
  }

  return value
}

const parseFlowArray = (raw: string): unknown[] => {
  const inner = raw.slice(1, -1).trim()
  if (!inner) return []

  const items: unknown[] = []
  let depth = 0
  let quote: string | null = null
  let start = 0
  for (let j = 0; j < inner.length; j++) {
    const ch = inner[j]
    if (quote) {
      if (ch === quote && inner[j - 1] !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (ch === '{' || ch === '[') depth++
    else if (ch === '}' || ch === ']') depth--
    else if (ch === ',' && depth === 0) {
      items.push(parseArrayItem(inner.slice(start, j)))
      start = j + 1
    }
  }
  const tail = inner.slice(start).trim()
  if (tail) items.push(parseArrayItem(tail))
  return items
}

const parseArrayItem = (raw: string): unknown => {
  const value = raw.trim()
  if (value.startsWith('{') && value.endsWith('}')) {
    const obj: Record<string, unknown> = {}
    const inner = value.slice(1, -1).trim()
    let depth = 0
    let quote: string | null = null
    let start = 0
    const pieces: string[] = []
    for (let j = 0; j < inner.length; j++) {
      const ch = inner[j]
      if (quote) {
        if (ch === quote && inner[j - 1] !== '\\') quote = null
        continue
      }
      if (ch === '"' || ch === "'") {
        quote = ch
        continue
      }
      if (ch === '{' || ch === '[') depth++
      else if (ch === '}' || ch === ']') depth--
      else if (ch === ',' && depth === 0) {
        pieces.push(inner.slice(start, j))
        start = j + 1
      }
    }
    pieces.push(inner.slice(start))
    for (const piece of pieces) {
      const colon = piece.indexOf(':')
      if (colon === -1) continue
      const k = piece.slice(0, colon).trim().replace(/^['"]|['"]$/g, '')
      const v = piece.slice(colon + 1).trim()
      obj[k] = parseScalar(v)
    }
    return obj
  }
  return parseScalar(value)
}

const requireString = (data: Record<string, unknown>, key: string): string => {
  const v = data[key]
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Missing required string field "${key}"`)
  }
  return v
}

const stringOr = (data: Record<string, unknown>, key: string, fallback: string): string => {
  const v = data[key]
  return typeof v === 'string' && v.trim() ? v : fallback
}

const optionalString = (data: Record<string, unknown>, key: string): string | undefined => {
  const v = data[key]
  return typeof v === 'string' && v.trim() ? v : undefined
}

const toStringArray = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) return []
  return raw.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
}

const toStatus = (raw: unknown): FrontendProjectStatus => {
  if (raw === 'released' || raw === 'developing' || raw === 'closed' || raw === 'unknown') return raw
  return 'unknown'
}
