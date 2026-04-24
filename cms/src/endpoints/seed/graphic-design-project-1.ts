import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type GraphicDesignProjectArgs = {
  heroImage: Media
  blockImage: Media
}

export const graphicDesignProject1: (
  args: GraphicDesignProjectArgs,
) => RequiredDataFromCollectionSlug<'graphic-design-projects'> = ({ heroImage, blockImage }) => {
  return {
    slug: 'lumen-brand-system',
    _status: 'published',
    title: 'Lumen Brand System',
    description:
      'Identity and design system for a boutique lighting studio, spanning print, signage, and a modular type scale.',
    status: 'released',
    demoUrl: 'https://lumen.example.com',
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
                text: 'Warmth, calibrated',
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
                text: 'Lumen needed an identity that read as both technical and hospitable. The resulting system pairs a crisp grotesque with a hand-drawn accent face and a palette anchored in photometric color temperatures.',
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
        'Identity and design system for a boutique lighting studio, spanning print, signage, and a modular type scale.',
      image: heroImage.id,
      title: 'Lumen Brand System',
    },
    relatedProjects: [],
  }
}
