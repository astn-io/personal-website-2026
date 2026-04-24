import { RequiredDataFromCollectionSlug } from 'payload'
import type { GraphicDesignProjectArgs } from './graphic-design-project-1'

export const graphicDesignProject2: (
  args: GraphicDesignProjectArgs,
) => RequiredDataFromCollectionSlug<'graphic-design-projects'> = ({ heroImage, blockImage }) => {
  return {
    slug: 'fieldnotes-poster-series',
    _status: 'published',
    title: 'Fieldnotes Poster Series',
    description:
      'A six-piece risograph poster series documenting small-town field recordings from the Pacific Northwest.',
    status: 'released',
    heroImage: heroImage.id,
    images: [heroImage.id, blockImage.id],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [
              {
                type: 'text',
                text: 'Sound made visible',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Each poster translates a 60-second audio clip into a layered risograph print. Waveform envelopes drive the composition; spectrograms inform the ink separations.',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    meta: {
      description:
        'A six-piece risograph poster series documenting small-town field recordings from the Pacific Northwest.',
      image: heroImage.id,
      title: 'Fieldnotes Poster Series',
    },
    relatedProjects: [],
  }
}
