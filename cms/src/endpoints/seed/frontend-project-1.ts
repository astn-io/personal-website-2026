import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type FrontendProjectArgs = {
  heroImage: Media
  blockImage: Media
}

export const frontendProject1: (
  args: FrontendProjectArgs,
) => RequiredDataFromCollectionSlug<'frontend-projects'> = ({ heroImage, blockImage }) => {
  return {
    slug: 'orbital-dashboard',
    _status: 'published',
    title: 'Orbital Dashboard',
    description:
      'A real-time telemetry dashboard for satellite operators, built with Svelte 5 runes and a custom WebSocket transport.',
    status: 'released',
    repositoryUrl: 'https://github.com/example/orbital-dashboard',
    demoUrl: 'https://orbital-dashboard.example.com',
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
                text: 'Streaming telemetry, reimagined',
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
                text: 'Orbital pushes live telemetry from a custom WebSocket gateway into a reactive grid of charts, with sub-second latency even across thousands of data points. The runes-based state model keeps the UI responsive without the ceremony of a dedicated store.',
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
        'A real-time telemetry dashboard for satellite operators, built with Svelte 5 runes and a custom WebSocket transport.',
      image: heroImage.id,
      title: 'Orbital Dashboard',
    },
    relatedProjects: [],
  }
}
