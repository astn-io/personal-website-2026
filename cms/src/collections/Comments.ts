import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['authorName', 'post', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => {
      if (req.user) return true
      return { status: { equals: 'approved' } }
    },
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'comments',
      admin: { position: 'sidebar' },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorEmail',
      type: 'email',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: authenticated,
        update: authenticated,
      },
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'upvotes',
      type: 'number',
      defaultValue: 0,
      access: {
        create: authenticated,
        update: authenticated,
      },
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'downvotes',
      type: 'number',
      defaultValue: 0,
      access: {
        create: authenticated,
        update: authenticated,
      },
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  timestamps: true,
}
