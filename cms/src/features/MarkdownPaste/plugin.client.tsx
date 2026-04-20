'use client'

import { useEditorConfigContext } from '@payloadcms/richtext-lexical/client'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $convertFromMarkdownString } from '@payloadcms/richtext-lexical'
import { COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical'
import { useEffect } from 'react'

// Only intercept paste when the text contains block-level markdown.
// Inline-only pastes (a word, a sentence) fall through to the default handler.
const BLOCK_MARKDOWN_RE = /^#{1,6}\s|^[-*+]\s|\d+\.\s|^>\s|^---+$/m

export function MarkdownPastePlugin() {
  const [editor] = useLexicalComposerContext()
  const { editorConfig } = useEditorConfigContext()

  useEffect(() => {
    return editor.registerCommand<ClipboardEvent>(
      PASTE_COMMAND,
      (event) => {
        const text = event.clipboardData?.getData('text/plain')
        if (!text || !BLOCK_MARKDOWN_RE.test(text)) return false

        event.preventDefault()
        const transformers = editorConfig.features.markdownTransformers ?? []
        editor.update(() => {
          $convertFromMarkdownString(text, transformers)
        })
        return true
      },
      COMMAND_PRIORITY_LOW,
    )
  }, [editor, editorConfig.features.markdownTransformers])

  return null
}
