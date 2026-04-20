'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { MarkdownPastePlugin } from './plugin.client'

export const MarkdownPasteFeatureClient = createClientFeature({
  plugins: [{ Component: MarkdownPastePlugin, position: 'normal' }],
})
