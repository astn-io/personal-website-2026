type LexicalNode = Record<string, unknown>

const textNode = (text: string): LexicalNode => ({
  type: 'text',
  text,
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const paragraphNode = (text: string): LexicalNode => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const headingNode = (tag: 'h1' | 'h2' | 'h3' | 'h4', text: string): LexicalNode => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

const listItemNode = (text: string, value: number): LexicalNode => ({
  type: 'listitem',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  value,
  version: 1,
})

const unorderedListNode = (items: string[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, i) => listItemNode(item, i + 1)),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const mediaBlockNode = (mediaId: number | string): LexicalNode => ({
  type: 'block',
  fields: {
    blockName: '',
    blockType: 'mediaBlock',
    media: mediaId,
  },
  format: '',
  version: 2,
})

export const wrapRoot = (children: LexicalNode[]): { root: LexicalNode } => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

/**
 * Lightweight markdown-to-Lexical converter for seed data. Supports:
 * - ATX headings (# through ####, deeper demoted to h4)
 * - Paragraphs (lines joined with spaces, blank-line separated)
 * - Unordered list blocks (consecutive `-` or `*` lines)
 *
 * Any unrecognised block (code fences, tables, images, etc.) is rendered as a
 * plain paragraph. Inline markdown (**bold**, _italic_, links) is stripped to
 * plain text to keep the output predictable for seeded demo content.
 */
export const markdownToLexicalNodes = (markdown: string): LexicalNode[] => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const nodes: LexicalNode[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    const text = paragraph.join(' ').trim()
    if (text) nodes.push(paragraphNode(stripInline(text)))
    paragraph = []
  }
  const flushList = () => {
    if (list.length === 0) return
    nodes.push(unorderedListNode(list.map(stripInline)))
    list = []
  }
  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.trim() === '') {
      flushAll()
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushAll()
      const level = Math.min(headingMatch[1].length, 4) as 1 | 2 | 3 | 4
      nodes.push(headingNode(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4', stripInline(headingMatch[2])))
      continue
    }

    const listMatch = line.match(/^[-*+]\s+(.*)$/)
    if (listMatch) {
      flushParagraph()
      list.push(listMatch[1])
      continue
    }

    flushList()
    paragraph.push(line.trim())
  }

  flushAll()
  return nodes
}

const stripInline = (text: string): string =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
