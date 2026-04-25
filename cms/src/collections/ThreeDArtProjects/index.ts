import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { MarkdownPasteFeature } from '../../features/MarkdownPaste'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const ThreeDArtProjects: CollectionConfig = {
  slug: 'three-d-art-projects',
  labels: {
    singular: '3D Art Project',
    plural: '3D Art Projects',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'status', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    MarkdownPasteFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
        },
        {
          label: 'Download',
          fields: [
            {
              name: 'modelFile',
              type: 'upload',
              relationTo: 'model-files',
              admin: {
                description:
                  'The 3D model file users can download (GLB, FBX, OBJ, ZIP, etc).',
              },
            },
            {
              name: 'downloadLabel',
              type: 'text',
              admin: {
                description:
                  'Optional label shown on the model download button. Defaults to "Download model".',
              },
            },
            {
              name: 'texturesFile',
              type: 'upload',
              relationTo: 'model-files',
              admin: {
                description:
                  'Optional textures-only archive (e.g. ZIP of the textures folder). Lets users download textures separately from the model — useful when the model is updated but the textures are not, since textures usually account for most of the download size.',
              },
            },
            {
              name: 'texturesDownloadLabel',
              type: 'text',
              admin: {
                description:
                  'Optional label shown on the textures download button. Defaults to "Download textures".',
              },
            },
          ],
        },
        {
          label: 'Preview Models',
          fields: [
            {
              name: 'previewModels',
              type: 'upload',
              relationTo: 'model-files',
              hasMany: true,
              admin: {
                description:
                  'Self-contained .glb files only. Separated .gltf + .bin + textures will not render — Payload stores each upload as a single file, so the relative URIs the .gltf depends on cannot be resolved. Convert to .glb (e.g. via gltf-pipeline) before uploading.',
              },
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedProjects',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'three-d-art-projects',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'tags',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'tags',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unknown',
      options: [
        { label: 'Released', value: 'released' },
        { label: 'In Development', value: 'developing' },
        { label: 'Closed', value: 'closed' },
        { label: 'Unknown', value: 'unknown' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Archived projects remain published but are hidden from listings.',
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
