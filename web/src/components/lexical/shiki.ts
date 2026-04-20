import { createHighlighter, type Highlighter } from 'shiki';
import astnTheme from '@styles/shiki-theme.json' with { type: 'json' };

const THEME_NAME = 'astn';
const SUPPORTED_LANGS = ['typescript', 'javascript', 'css', 'html', 'json', 'bash', 'svelte', 'astro', 'markdown'] as const;

type SupportedLang = (typeof SUPPORTED_LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [astnTheme as Parameters<typeof createHighlighter>[0]['themes'][number]],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

function resolveLang(lang: string | undefined): SupportedLang {
  if (!lang) return 'typescript';
  if ((SUPPORTED_LANGS as readonly string[]).includes(lang)) {
    return lang as SupportedLang;
  }
  return 'typescript';
}

export async function highlightCode(
  code: string,
  lang: string | undefined,
): Promise<string> {
  const highlighter = await getHighlighter();
  const resolvedLang = resolveLang(lang);

  return highlighter.codeToHtml(code, {
    lang: resolvedLang,
    theme: THEME_NAME,
    transformers: [
      {
        pre(node) {
          node.properties.class = 'astro-code';
          node.properties['data-language'] = resolvedLang;
        },
      },
    ],
  });
}
