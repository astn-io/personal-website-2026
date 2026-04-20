import { marked, type Renderer } from 'marked'
import DOMPurify from 'dompurify'

const renderer: Partial<Renderer> = {
  code({ text, lang }) {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const langAttr = lang ? ` class="language-${lang}" data-language="${lang}"` : ''
    return `<pre class="comment-code-block"><code${langAttr}>${escaped}</code></pre>`
  },
}

marked.use({ renderer, gfm: true, breaks: true })

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'del', 's', 'code', 'pre',
  'a', 'ul', 'ol', 'li', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'hr',
]

const ALLOWED_ATTR = ['href', 'class', 'data-language', 'target', 'rel']

let hookInstalled = false

function ensureLinkHook() {
  if (hookInstalled) return
  hookInstalled = true
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })
}

export function renderMarkdown(content: string): string {
  if (typeof window === 'undefined') return content
  ensureLinkHook()
  const raw = marked.parse(content) as string
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS, ALLOWED_ATTR })
}
