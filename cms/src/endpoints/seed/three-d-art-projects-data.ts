export type ThreeDArtStatus = 'released' | 'developing' | 'closed' | 'unknown'

export interface ThreeDArtProjectSeed {
  slug: string
  title: string
  description: string
  status: ThreeDArtStatus
  category: string
  tags: string[]
  featured?: boolean
  /** Short overview paragraph for the rich-text body. */
  overview: string
  /** Bullet list of highlights for the rich-text body. */
  highlights: string[]
  /**
   * Base filename (without extension) of the matching `.glb` and `.zip`
   * pair under `content/3d-models/`. The seed loads `${assetBase}.glb` for
   * the inline preview and `${assetBase}.zip` for the download button.
   */
  assetBase: string
  /**
   * Filename (with extension) of the cover image under `content/3d-models/`.
   * Uploaded as media and used as the hero image for the project.
   */
  coverImage: string
  /** Alt text for the cover image. */
  coverAlt: string
  /** Optional override for the model download button label. */
  downloadLabel?: string
}

export const threeDArtProjectSeeds: ThreeDArtProjectSeed[] = [
  {
    slug: 'blue-archive-miyako',
    title: 'Blue Archive — Miyako',
    description:
      'Stylized fan-recreation of the Blue Archive character Miyako, packed as a single-file GLB for an in-browser Three.js preview.',
    status: 'released',
    category: '3D Character',
    tags: ['GLB', 'Three.js', 'Character', 'Stylized'],
    featured: true,
    assetBase: 'blue_archive_miyako',
    coverImage: 'miyako-cover.jpg',
    coverAlt: 'Stylized 3D render of the Blue Archive character Miyako',
    downloadLabel: 'Download source (.zip)',
    overview:
      'A high-fidelity stylized character split across roughly twenty PBR materials covering hair, uniform, accessories, and skin. Bundled as a self-contained GLB so the inline preview can stream a single asset rather than chasing relative texture URIs.',
    highlights: [
      'Multi-material PBR setup with paired baseColor and metallic/roughness maps',
      'GLB binary packaging keeps preview loads to a single round-trip',
      'Source ZIP with the separated glTF + bin + textures available for download',
    ],
  },
  {
    slug: 'cute-bunny',
    title: 'Cute Bunny',
    description:
      'A pair of low-poly stylized bunnies with hand-painted base color textures, rigged for snappy web preview.',
    status: 'released',
    category: '3D Creature',
    tags: ['GLB', 'Three.js', 'Stylized', 'Low Poly'],
    assetBase: 'cute_bunny',
    coverImage: 'cute-bunny-cover.jpg',
    coverAlt: 'Stylized 3D render of two cute low-poly bunny characters',
    downloadLabel: 'Download source (.zip)',
    overview:
      'Two friendly bunny variants sharing a base mesh, each with its own face, body, and scarf maps. Hand-painted base color art keeps the asset light enough that the inline preview pops in well under a second on a warm cache.',
    highlights: [
      'Two color variants packed into one GLB scene',
      'Single-material baked color workflow — no metallic/roughness pass needed',
      'Roughly 2 MB on disk, ideal as a first-paint preview reference',
    ],
  },
  {
    slug: 'urban-warrior',
    title: 'Urban Warrior',
    description:
      'A stylized warrior character mesh split across body, hair, eye, and sticker materials, built for real-time rendering.',
    status: 'released',
    category: '3D Character',
    tags: ['GLB', 'Three.js', 'Character', 'Stylized'],
    assetBase: 'urbanwarrior_mesh',
    coverImage: 'urban-warrior-cover.jpg',
    coverAlt: 'Stylized 3D render of the Urban Warrior character mesh',
    downloadLabel: 'Download source (.zip)',
    overview:
      'A modular warrior character separated into body, hair, eye, and sticker materials so individual passes can be retouched without re-baking the rest of the figure. Stylized PBR setup that holds up under simple HDRI lighting.',
    highlights: [
      'Per-material albedo authoring across body, hair, eyes, and decals',
      'Stylized PBR-friendly shading tuned for browser-side Three.js',
      'GLB preview plus a separated-source ZIP for downstream tinkering',
    ],
  },
]
