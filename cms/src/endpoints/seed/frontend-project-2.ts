import { RequiredDataFromCollectionSlug } from 'payload'
import type { FrontendProjectArgs } from './frontend-project-1'

export const frontendProject2: (
  args: FrontendProjectArgs,
) => RequiredDataFromCollectionSlug<'frontend-projects'> = ({ heroImage, blockImage }) => {
  return {
    slug: 'tidepool-notes',
    _status: 'published',
    title: 'Tidepool Notes',
    description:
      'A local-first note-taking app with CRDT sync and offline Markdown editing, packaged as a PWA.',
    status: 'developing',
    repositoryUrl: 'https://github.com/example/tidepool-notes',
    frontendmentorUrl: 'https://www.frontendmentor.io/challenges/tidepool',
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
                text: 'Offline-first, sync-second',
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
                text: 'Tidepool stores notes in an append-only CRDT log so edits merge cleanly across devices, even after long offline stretches. The editor is a thin Astro + Svelte shell over a WASM Markdown parser.',
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
              blockName: 'Sync loop',
              blockType: 'code',
              code: "export async function pullUpdates(since: number) {\n  const res = await fetch(`/api/sync?since=${since}`)\n  const updates = await res.json()\n  for (const update of updates) {\n    doc.applyRemote(update)\n  }\n  return doc.version\n}\n",
              language: 'typescript',
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
        'A local-first note-taking app with CRDT sync and offline Markdown editing, packaged as a PWA.',
      image: heroImage.id,
      title: 'Tidepool Notes',
    },
    relatedProjects: [],
  }
}
