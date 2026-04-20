import { createServerFeature } from '@payloadcms/richtext-lexical'

export const MarkdownPasteFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/MarkdownPaste/feature.client#MarkdownPasteFeatureClient',
  },
  key: 'markdownPaste',
})
