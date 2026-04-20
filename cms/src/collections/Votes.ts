import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Votes: CollectionConfig = {
  slug: 'votes',
  admin: {
    defaultColumns: ['comment', 'voterId', 'type', 'createdAt'],
  },
  access: {
    create: () => true,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'comment',
      type: 'relationship',
      relationTo: 'comments',
      required: true,
    },
    {
      name: 'voterId',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Upvote', value: 'up' },
        { label: 'Downvote', value: 'down' },
      ],
    },
  ],
  timestamps: true,
}
