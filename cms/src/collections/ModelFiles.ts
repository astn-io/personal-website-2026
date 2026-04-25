import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const ModelFiles: CollectionConfig = {
  slug: 'model-files',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'filename',
    description: 'Downloadable 3D model files (GLB, GLTF, FBX, OBJ, ZIP archives, etc).',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      admin: {
        description: 'Optional human-readable label shown on the download button.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/model-files'),
    mimeTypes: [
      'model/gltf-binary',
      'model/gltf+json',
      'application/octet-stream',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-tgif',
      'application/x-blender',
      'application/vnd.ms-pki.stl',
      'model/stl',
      'model/obj',
      'application/x-fbx',
      'application/x-7z-compressed',
    ],
  },
}
