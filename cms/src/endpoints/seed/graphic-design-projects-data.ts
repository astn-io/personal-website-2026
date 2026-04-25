export type GraphicDesignStatus = 'released' | 'developing' | 'closed' | 'unknown'

export interface GraphicDesignProjectSeed {
  slug: string
  title: string
  description: string
  status: GraphicDesignStatus
  category: string
  tags: string[]
  featured?: boolean
  demoUrl?: string
  /** Short overview paragraph for the rich-text body. */
  overview: string
  /** Bullet list of highlights for the rich-text body. */
  highlights: string[]
}

export const graphicDesignProjectSeeds: GraphicDesignProjectSeed[] = [
  {
    slug: 'lumen-brand-system',
    title: 'Lumen Brand System',
    description:
      'Identity and design system for a boutique lighting studio, spanning print, signage, and a modular type scale.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Print', 'Typography'],
    featured: true,
    demoUrl: 'https://lumen.example.com',
    overview:
      'Lumen needed an identity that read as both technical and hospitable. The system pairs a crisp grotesque with a hand-drawn accent face and a palette anchored in photometric color temperatures.',
    highlights: [
      'Primary and secondary logo lockups with a responsive reduction set',
      'Modular 1.25 type scale documented in a brand guideline PDF',
      'Print-ready stationery templates and signage specs',
    ],
  },
  {
    slug: 'north-haven-poster-series',
    title: 'North Haven Poster Series',
    description:
      'A three-poster concert series for an indie venue, riveted around high-contrast typography and risograph-inspired textures.',
    status: 'released',
    category: 'Poster',
    tags: ['Print', 'Typography', 'Risograph'],
    overview:
      'Each poster pairs an oversized headline with a layered texture pass that simulates the misregistration of a two-color riso print. The series keeps the grid constant while rotating color and imagery.',
    highlights: [
      'Two-color riso simulation built in Photoshop smart objects',
      'Shared 6-column grid across all three posters',
      'Accessible contrast ratios verified against WCAG 2.2 AA',
    ],
  },
  {
    slug: 'harvest-route-packaging',
    title: 'Harvest Route Packaging',
    description:
      'Packaging identity for a regional coffee roaster, with hand-lettered varietal marks and SKU-coded color tabs.',
    status: 'released',
    category: 'Packaging',
    tags: ['Packaging', 'Print', 'Identity'],
    overview:
      'The packaging reads like a shipping manifest: route codes, elevation, and roast date sit alongside a hand-drawn seal for each origin. The SKU tab wraps the seam so shelves scan at a glance.',
    highlights: [
      'Six hand-lettered varietal seals with a consistent compound curve',
      'SKU-coded color tabs that double as shelf dividers',
      'Die-line compatible with existing 340g valve bag stock',
    ],
  },
  {
    slug: 'atrium-editorial-redesign',
    title: 'Atrium Editorial Redesign',
    description:
      'A full editorial refresh for a long-read architecture magazine, rebuilding the type system and feature layouts.',
    status: 'released',
    category: 'Editorial',
    tags: ['Editorial', 'Typography', 'Print'],
    overview:
      'Atrium asked for a redesign that honored its history of long-form criticism while working harder on mobile. The new type system pairs a wide display serif with a humanist sans optimized for long reads.',
    highlights: [
      'Variable display serif with optical sizing from 14pt to 96pt',
      'Feature templates for photo-essay, interview, and critique formats',
      'Masthead grid that rescales cleanly between print and web',
    ],
  },
  {
    slug: 'driftwave-album-art',
    title: 'Driftwave Album Art',
    description:
      'Cover and gatefold artwork for an ambient electronic record, rendered in a desaturated oceanic palette.',
    status: 'released',
    category: 'Album Art',
    tags: ['Album Art', 'Illustration', 'Print'],
    overview:
      'Driftwave asked for artwork that felt like a tide pulling back. I composed a gatefold spread that reads as a single image when flat, but splits into two distinct scenes when folded.',
    highlights: [
      'Gatefold layout that composes as one image and two',
      'Custom ligatures cut into the artist wordmark',
      'Print specs delivered for vinyl, CD, and streaming thumbnail',
    ],
  },
  {
    slug: 'quanta-conference-identity',
    title: 'Quanta Conference Identity',
    description:
      'Full identity package for a two-day developer conference, including wayfinding, stage graphics, and badge templates.',
    status: 'released',
    category: 'Event',
    tags: ['Event', 'Wayfinding', 'Identity'],
    featured: true,
    overview:
      'Quanta runs in a converted warehouse that makes wayfinding tricky. The identity leans on oversized numeric markers and a high-contrast type system that reads from across the floor.',
    highlights: [
      'Numeric wayfinding marks sized for 30m sightlines',
      'Badge templates with role-based color strips',
      'Animated stage graphics timed to a 45-minute cadence',
    ],
  },
  {
    slug: 'marrow-type-specimen',
    title: 'Marrow Type Specimen',
    description:
      'A 48-page specimen booklet for a new display serif, exploring weight, optical size, and stylistic sets.',
    status: 'released',
    category: 'Typography',
    tags: ['Typography', 'Print', 'Editorial'],
    overview:
      'Marrow is a display serif with aggressive ink traps that only resolve at display sizes. The specimen shows the typeface doing what it was made for: being loud.',
    highlights: [
      'Weight waterfall from hairline to black at 96pt',
      'Stylistic set comparison spreads with callouts',
      'Glyph map printed on a foldout back cover',
    ],
  },
  {
    slug: 'tidewater-wayfinding',
    title: 'Tidewater Wayfinding',
    description:
      'Wayfinding and signage program for a coastal research campus, with tide-inspired color mapping and tactile markers.',
    status: 'developing',
    category: 'Wayfinding',
    tags: ['Wayfinding', 'Environmental', 'Signage'],
    overview:
      'Each wing of the campus maps to a tidal state, with color and arrow geometry that shifts subtly between buildings. ADA-compliant tactile markers anchor every decision point.',
    highlights: [
      'Tide-mapped wing colors with confirmed photometric contrast',
      'Tactile markers compliant with ADA 703.2',
      'Specification book covering print, vinyl, and cast metal applications',
    ],
  },
  {
    slug: 'fieldnote-stationery',
    title: 'Fieldnote Stationery Kit',
    description:
      'A personal stationery system with letterhead, envelopes, correspondence cards, and a wax-sealed enclosure.',
    status: 'released',
    category: 'Stationery',
    tags: ['Stationery', 'Print', 'Identity'],
    overview:
      'Fieldnote is a deliberately slow correspondence kit. The system pairs letterpressed stock with a simple monogram that works equally well in foil and blind emboss.',
    highlights: [
      'Monogram reducible to 6mm without losing definition',
      'Letterpress specs for Crane Lettra 220gsm stock',
      'Wax seal die with a negative-space counterform',
    ],
  },
  {
    slug: 'orbit-festival-posters',
    title: 'Orbit Festival Posters',
    description:
      'Five-poster campaign for a weekend music festival, with a unified grid and rotating illustration style.',
    status: 'released',
    category: 'Poster',
    tags: ['Print', 'Illustration', 'Campaign'],
    overview:
      'Orbit rotates through five musical genres across the weekend, so each poster has its own illustrator brief but shares a common structural skeleton.',
    highlights: [
      'Unified 12-column grid across five illustration styles',
      'Shared headline treatment with per-poster color overrides',
      'Print specs for B1, B2, and 24-sheet bus-shelter formats',
    ],
  },
  {
    slug: 'verge-editorial-spreads',
    title: 'Verge Editorial Spreads',
    description:
      'Feature-opener spreads for a climate-focused digital magazine, balancing long-form type with data storytelling.',
    status: 'developing',
    category: 'Editorial',
    tags: ['Editorial', 'Data Viz', 'Typography'],
    overview:
      'Verge runs long investigations that rely heavily on charts and maps. The new feature-opener system leaves room for custom data art without breaking the article-reading flow.',
    highlights: [
      'Modular opener system for text-first, chart-first, or image-first features',
      'Custom chart style guide with accessibility annotations',
      'Pull-quote treatment that flexes between desktop and mobile',
    ],
  },
  {
    slug: 'amber-branding',
    title: 'Amber Brewery Branding',
    description:
      'Identity, packaging, and tap-handle program for a neighborhood brewery, with a family of illustrated beer icons.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Packaging', 'Illustration'],
    overview:
      'Amber wanted a system that could absorb a new seasonal beer every two months without redesigning the package. The icon family sits inside a fixed label frame and does all the differentiating.',
    highlights: [
      'Icon family spec for seasonal variants, shared stroke weight',
      'Tap-handle program with interchangeable top-plate inserts',
      'Label layout that prints on existing brewery stock',
    ],
  },
  {
    slug: 'meridian-book-cover',
    title: 'Meridian Book Cover',
    description:
      'Cover and jacket design for a novel about long-distance sailing, rendered in a muted two-color palette.',
    status: 'released',
    category: 'Book Design',
    tags: ['Book', 'Print', 'Typography'],
    overview:
      'The cover leans on negative space to suggest scale at sea. A restrained two-color palette keeps the type the loudest thing on the shelf.',
    highlights: [
      'Two-color process with a spot ink for the horizon line',
      'Custom ligatures in the author name',
      'Jacket flaps designed to echo the cover composition',
    ],
  },
  {
    slug: 'pulse-brand-refresh',
    title: 'Pulse Brand Refresh',
    description:
      'A measured brand refresh for a health-tech startup, retaining equity while modernizing the color system.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Design System', 'Digital'],
    overview:
      'Pulse had eight years of brand equity in their logomark. The refresh keeps the mark and rebuilds the system around it — new type, a calmer palette, and a digital component library.',
    highlights: [
      'Color system tuned for medical device contrast standards',
      'Digital component library with dark-mode support',
      'Motion guidelines for product UI and marketing',
    ],
  },
  {
    slug: 'folio-gallery-campaign',
    title: 'Folio Gallery Campaign',
    description:
      'Spring exhibition campaign for a contemporary art gallery, spanning posters, wayfinding, and social tiles.',
    status: 'released',
    category: 'Campaign',
    tags: ['Campaign', 'Print', 'Social'],
    overview:
      'The spring exhibition focuses on material experimentation, and the campaign reflects that with printed posters that vary by stock, print method, and size even though the composition is fixed.',
    highlights: [
      'Single composition output in four print methods',
      'Social tile set tuned for Instagram, LinkedIn, and Mastodon',
      'Wayfinding graphics applied to a 1,200 sq. ft. gallery floor',
    ],
  },
  {
    slug: 'cinder-menu-system',
    title: 'Cinder Restaurant Menu System',
    description:
      'A menu system for a wood-fired restaurant, including dinner, brunch, and a nightly chalkboard insert.',
    status: 'released',
    category: 'Print',
    tags: ['Menu', 'Print', 'Identity'],
    overview:
      'Cinder changes its menu weekly, so the system centers on an A4 insert that prints in-house. The outer folder is letterpress and handles the permanent brand voice.',
    highlights: [
      'Letterpress cover with a blind-embossed mark',
      'Weekly insert template with spec-accurate pricing grid',
      'Dietary icon set for allergens and sourcing',
    ],
  },
  {
    slug: 'arborist-report',
    title: 'Arborist Annual Report',
    description:
      'Annual report design for a nonprofit focused on urban tree canopies, built around a long data spread.',
    status: 'released',
    category: 'Editorial',
    tags: ['Editorial', 'Data Viz', 'Print'],
    overview:
      'The centerpiece of the report is a six-page foldout tracking canopy gain and loss across twelve neighborhoods. The rest of the publication supports that story with short interviews and field reports.',
    highlights: [
      'Six-page foldout gatefold with a single continuous data spread',
      'Interview section with a grid tuned for photo-and-quote pairing',
      'Print specs for 9×12 perfect-bound reports',
    ],
  },
  {
    slug: 'haiku-mobile-campaign',
    title: 'Haiku Mobile Campaign',
    description:
      'A short-form ad campaign for a meditation app, rendered as animated typographic stills for mobile placements.',
    status: 'released',
    category: 'Campaign',
    tags: ['Motion', 'Digital', 'Typography'],
    overview:
      'Each ad is a three-line haiku set in motion. The type animates line-by-line, and the whole thing resolves in under four seconds to fit mobile ad slot constraints.',
    highlights: [
      'Type system optimized for 9:16 and 1:1 crops',
      'Motion under 4 seconds per spot with a shared exit card',
      'Delivered in MP4 and animated AVIF for bandwidth-conscious placements',
    ],
  },
  {
    slug: 'sable-gallery-identity',
    title: 'Sable Gallery Identity',
    description:
      'Identity program for a photography gallery, built around a responsive wordmark and a single archival typeface.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Typography', 'Print'],
    overview:
      'Sable houses large-format prints, so the identity stays small and quiet. A single archival serif does most of the work, with a responsive wordmark that contracts to a mono-line glyph at small sizes.',
    highlights: [
      'Responsive wordmark with six fixed breakpoints',
      'Single-typeface system with a strict tracking table',
      'Applied across signage, print collateral, and web',
    ],
  },
  {
    slug: 'kindling-newsletter',
    title: 'Kindling Newsletter Identity',
    description:
      'Identity and template system for a design-focused newsletter, built around readable long-form web type.',
    status: 'released',
    category: 'Editorial',
    tags: ['Editorial', 'Digital', 'Typography'],
    overview:
      'Kindling is an email-first newsletter, so the template system prioritizes inbox rendering. A web mirror picks up the same type scale and reuses the same component set.',
    highlights: [
      'MJML email templates with consistent desktop/mobile rendering',
      'Web mirror that matches the email type scale exactly',
      'Pull-quote and footnote components shared across both surfaces',
    ],
  },
  {
    slug: 'grove-exhibition-wayfinding',
    title: 'Grove Exhibition Wayfinding',
    description:
      'Interior wayfinding and intro panels for a botanical garden exhibition, with hand-drawn plant glyphs.',
    status: 'released',
    category: 'Wayfinding',
    tags: ['Wayfinding', 'Environmental', 'Illustration'],
    overview:
      'The exhibition walks visitors through the life cycle of seven native plants. Each plant gets a glyph that travels with it through the wayfinding, the catalog, and the take-home card.',
    highlights: [
      'Seven custom plant glyphs with a shared 2px stroke weight',
      'Intro panels specified for 900mm × 1,400mm',
      'Take-home card printed on seed paper',
    ],
  },
  {
    slug: 'tempo-music-identity',
    title: 'Tempo Music School Identity',
    description:
      'Identity refresh for a community music school, with a monogram derived from musical notation.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Education', 'Illustration'],
    overview:
      'The refreshed monogram reads as a stylized quarter note at large sizes and a tidy letterform at small ones. The full system extends to flyers, program books, and student ID cards.',
    highlights: [
      'Monogram that reads as both letter and notation',
      'Program book template with a flexible program-listing grid',
      'Student ID card layout with tactile seasonal chip',
    ],
  },
  {
    slug: 'ember-packaging',
    title: 'Ember Candle Packaging',
    description:
      'Packaging and label system for a small-batch candle maker, printed on uncoated recycled stock.',
    status: 'released',
    category: 'Packaging',
    tags: ['Packaging', 'Print', 'Typography'],
    overview:
      'Ember prints in-house on a desktop laser printer, so the label system had to tolerate inconsistent registration and still look intentional. The result leans into imperfection as a brand asset.',
    highlights: [
      'Label layout tuned for 15% registration drift',
      'Monochrome design that prints on any color wax',
      'Per-scent custom wordmarks sharing a common skeleton',
    ],
  },
  {
    slug: 'loam-brand-guidelines',
    title: 'Loam Brand Guidelines',
    description:
      'A 120-page brand guideline document for a soil-health startup, structured around an expandable token system.',
    status: 'released',
    category: 'Design System',
    tags: ['Design System', 'Editorial', 'Print'],
    overview:
      'Loam needed a guideline document that could grow with the brand. The structure is modular — add a chapter, not a redesign — and every spec includes both a visual and a machine-readable token reference.',
    highlights: [
      'Tokens exported as JSON for direct product consumption',
      'Modular chapter structure with consistent opener spreads',
      'Printed as a 120-page perfect-bound book with a Smyth-sewn binding',
    ],
  },
  {
    slug: 'rivet-social-toolkit',
    title: 'Rivet Social Toolkit',
    description:
      'A social-media toolkit for an industrial design studio, with templated posts for LinkedIn, Instagram, and Mastodon.',
    status: 'released',
    category: 'Digital',
    tags: ['Social', 'Digital', 'Template'],
    overview:
      'Rivet posts about once a week and needed a toolkit that a single studio lead could operate without dropping the brand. The templates encode decisions — type scale, padding, photo crop — so operators only edit content.',
    highlights: [
      'Twelve templated post formats across three platforms',
      'Shared aspect-ratio system with consistent safe zones',
      'Operator guide written for non-designers',
    ],
  },
  {
    slug: 'cobalt-campaign-site',
    title: 'Cobalt Campaign Microsite',
    description:
      'Design system and layout for a political campaign microsite, including donation flow and district-specific landing pages.',
    status: 'closed',
    category: 'Digital',
    tags: ['Digital', 'Campaign', 'Design System'],
    overview:
      'Cobalt ran as a 90-day microsite with sixteen district-specific landing pages. The system centralizes the top-of-page hero and lets district leads swap photos, copy, and endorsements without dev support.',
    highlights: [
      'Modular hero with district-swappable photography and copy',
      'Donation flow optimized for mobile completion rates',
      'Accessibility audit completed at launch and day-45',
    ],
  },
  {
    slug: 'basin-exhibition-catalog',
    title: 'Basin Exhibition Catalog',
    description:
      'Exhibition catalog for a regional photography retrospective, designed as a companion object to the show itself.',
    status: 'released',
    category: 'Book Design',
    tags: ['Editorial', 'Photography', 'Print'],
    overview:
      'Basin retrospectives have happened every five years since 1980; this catalog had to sit on a shelf next to six predecessors and feel like a natural next volume. The cover treatment and binding match that lineage.',
    highlights: [
      'Cover treatment consistent with the 1980–2020 volumes',
      'Photo reproduction targets verified against a Kodak Q-60 card',
      'Print run of 1,500 with a Smyth-sewn binding',
    ],
  },
  {
    slug: 'kindle-podcast-identity',
    title: 'Kindle Podcast Identity',
    description:
      'Logo, episode artwork system, and social trailer cards for an interview podcast about early-career designers.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Digital', 'Motion'],
    overview:
      'The episode artwork templates let a producer swap a guest photo and name without touching the composition. Trailer cards render out as 15-second social video with a shared motion pass.',
    highlights: [
      'Episode artwork template with two guest-photo crops',
      'Shared 15-second motion template for trailer cards',
      'Delivery guide for Apple Podcasts, Spotify, and Overcast',
    ],
  },
  {
    slug: 'mosaic-annual',
    title: 'Mosaic Annual',
    description:
      'Annual anthology design for a nonprofit collaborative, with 32 contributor spreads and a shared grid.',
    status: 'released',
    category: 'Editorial',
    tags: ['Editorial', 'Print', 'Typography'],
    overview:
      'The annual gathers 32 contributors under one cover. Every spread uses the same underlying grid, but each contributor controls color, imagery, and their headline typeface from an approved set.',
    highlights: [
      'Shared 9-column grid with 32 contributor-controlled spreads',
      'Approved display typeface set curated for distinct voice',
      'Index and colophon designed as a matched pair',
    ],
  },
  {
    slug: 'thicket-zine',
    title: 'Thicket Zine Volume One',
    description:
      'Editorial design for the debut issue of a self-published zine focused on overlooked public landscapes.',
    status: 'released',
    category: 'Editorial',
    tags: ['Editorial', 'Print', 'Zine'],
    overview:
      'Thicket is a 48-page self-published zine. I designed the masthead, house grid, and article templates, and worked with the editor on a print plan for a run of 500 copies.',
    highlights: [
      'Masthead and house grid for future volumes',
      'Article templates for photo essay, interview, and short fiction',
      'Print plan for a 500-copy offset run on uncoated stock',
    ],
  },
  {
    slug: 'beacon-brand-system',
    title: 'Beacon Bookstore Brand System',
    description:
      'Brand system for an independent bookstore, including storefront signage, shelf talkers, and a staff-picks poster line.',
    status: 'released',
    category: 'Brand Identity',
    tags: ['Identity', 'Retail', 'Print'],
    overview:
      'Beacon moves through a few themes a year, so the brand system includes a recurring staff-picks poster line that can be generated from a template without designer input.',
    highlights: [
      'Storefront signage with confirmed ADA-compliant type sizing',
      'Shelf talker template with consistent bibliographic fields',
      'Staff-picks poster generator (InDesign data merge)',
    ],
  },
  {
    slug: 'wayfarer-campaign',
    title: 'Wayfarer Travel Campaign',
    description:
      'A national campaign for a travel brand launching regional itineraries, spanning OOH, print, and digital placements.',
    status: 'released',
    category: 'Campaign',
    tags: ['Campaign', 'Print', 'Digital'],
    overview:
      'Wayfarer launched six regional itineraries at once. The campaign centers on a single headline system that rehoused per region, with photography and color carrying the differentiation.',
    highlights: [
      'Headline system rehoused across six regions',
      'OOH specs for 14×48 bulletins and 6-sheet bus shelters',
      'Digital placements in 1×1, 4×5, and 16×9 crops',
    ],
  },
  {
    slug: 'alcove-interior-signage',
    title: 'Alcove Interior Signage',
    description:
      'Interior signage and room numbering program for a boutique hotel, with tactile plaques and guest-facing maps.',
    status: 'developing',
    category: 'Wayfinding',
    tags: ['Wayfinding', 'Environmental', 'Hospitality'],
    overview:
      'Alcove has 42 rooms across three floors with an unusual numbering scheme. The signage program turns that quirk into an asset, with tactile plaques that read well from the hallway and up close.',
    highlights: [
      'Tactile room plaques compliant with ADA 703.2',
      'Floor map prints sized for in-room placement',
      'Wayfinding type system that flexes to non-standard numbering',
    ],
  },
]
