# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

pnpm monorepo with two packages:

- `web/` — Astro frontend (Node SSR adapter, but pages still use `getStaticPaths` for prerendering)
- `cms/` — Payload CMS (Next.js app, MongoDB-backed)

Run commands from the repo root unless you need a package-scoped script.

## Build & Development Commands

- `pnpm install` — install deps for both packages
- `pnpm dev` — run `web` and `cms` dev servers in parallel
- `pnpm dev:web` — Astro only at `localhost:4321`
- `pnpm dev:cms` — Payload admin only at `localhost:3000/admin`
- `pnpm build` — build both packages
- `pnpm lint` — run lint where defined (currently only `cms`)
- `cd web && npx astro sync` — regenerate `.astro/content.d.ts` after editing `web/src/content.config.ts`
- `cd cms && pnpm payload generate:types` — regenerate `cms/src/payload-types.ts` after schema changes
- No test runner or linter configured for `web/`
- Node >=22.12.0, pnpm ^9 || ^10

The Astro blog loader fetches from Payload at dev/build time — start the CMS first, or blog posts won't appear. If Payload is unreachable the loader logs a warning and leaves the blog collection empty rather than failing sync.

## Environment

- `PAYLOAD_URL` (preferred) or `NEXT_PUBLIC_SERVER_URL` — base URL for Payload REST API. `web/astro.config.mjs` calls `loadEnv()` from `payload/node` to pick these up from `cms/.env`, and derives `image.remotePatterns` from the same URL so `astro:assets` can optimize Payload-hosted media.

## Payload CMS skill

Use the skill at `.claude/skills/payload/` (`SKILL.md` for quick reference, `reference/` for detailed docs) when working inside `cms/` — collections, fields, hooks, access control, queries.

## Architecture (web/)

### Component Split

- **Astro components** (`.astro`): layouts, pages, sections, structural/static elements (ParticleBackground, VideoBackground, Footer, FeaturedLinks)
- **Svelte components** (`.svelte`): interactive elements using Svelte 5 runes (`$state()`, `$props()`) — AppBar, Navigation, Button, LightToggle
- **Shared Svelte state** (`web/src/components/state/`): module-level `$state()` runes for cross-component state (`appBarState.svelte.ts`, `mobileMenuState.svelte.ts`)

### Content Collections

Defined in `web/src/content.config.ts`. Five collections, loaded from different sources:

- `blog` — **custom loader** (`web/src/loaders/payloadPostsLoader.ts`) fetching from `${PAYLOAD_URL}/api/posts?depth=2&draft=false`. The loader maps Payload's shape (heroImage, categories, tags, authors, Lexical content) into the Zod schema. `coverImage` is a remote-image object `{ url, width, height, alt }`, not `ImageMetadata`. `content` holds raw Lexical JSON.
- `guides`, `frontendProjects` — still glob loaders reading local Markdown; migration to Payload is pending
- `internalLinks`, `externalLinks` — `file()` loaders reading JSON from `web/content/` (not `web/src/content/`)

The `blog` collection used to have `public`/`archived` frontmatter gating visibility; Payload's draft/publish system now handles publishing, and `archived` is filtered explicitly in `blog/[id].astro` and `blog/[...page].astro`. For the other collections the old flags still apply.

### Image Shape Duality

Since the blog loader returns remote images, cards and layouts accept `ImageMetadata | RemoteImage`. `Card.astro`, `CardImage.astro`, `BlogCard.astro`, and `PostLayout.astro` all branch on whether the image is remote (`'url' in image`) and pass explicit `width`/`height` props when so. When adding new components that render cover images for blog entries, preserve this pattern.

### Lexical Renderer

`web/src/components/lexical/` converts Payload rich text JSON into Astro output.

- `LexicalRenderer.astro` is the entry point (takes `content: LexicalRoot`, iterates `root.children`)
- `LexicalNode.astro` is self-recursive; switches on `node.type` and renders paragraphs, headings, lists, quotes, links, horizontal rules, uploads, and blocks
- Block nodes (Lexical type `'block'`) dispatch on `fields.blockType`: `code` → `CodeBlock.astro` (Shiki, `astn` theme, output gets `.astro-code` class + `data-language` so `initCodeCopy.ts` still works), `banner` → `BannerBlock.astro`, `mediaBlock` → `MediaBlockNode.astro`
- `TextNode.astro` renders formatted text via the Lexical bitmask (`TEXT_FORMAT` in `types.ts`) using `set:html` on escaped text
- `shiki.ts` caches a single highlighter instance; add new languages to `SUPPORTED_LANGS` there if you expand Payload's Code block options

Inline Markdown code blocks still go through Astro's built-in Shiki. Both paths emit the same `.astro-code` class so they share `code.scss` styles and `initCodeCopy.ts` post-processing.

### Routing & Pagination

- Pages live in `web/src/pages/` with file-based routing (`blog/[id].astro` for dynamic routes, `[...page].astro` for paginated indexes)
- Featured blog entries are surfaced on page 1 of the listing via the `featured` field (now on Payload's Posts collection)
- `fieldDataUtils.ts` derives categories/tags from `getCollection()` results as string arrays — the Payload loader flattens categories[0].title and tags.map(t => t.title) to keep this helper working without changes

### Layout System

- `CommonHead.astro` — `<head>` fragment with meta tags, favicon links, ClientRouter, and an inline `<script is:inline>` that initializes the theme before first paint. Exposes `window.updateFavicons()` globally for LightToggle
- `Base.astro` — wraps all pages; composes CommonHead, AppBar (persisted via `transition:persist`), Drawer (mobile menu), Footer, scroll restoration, scroll animation init
- `Directory.astro` — reusable paginated listing; composes DirectoryHero, DirectoryFields (categories/tags sidebar), card lists, Paginator
- `Taxonomy.astro` — grid layout for category/tag index pages with staggered scroll-reveal
- `PostLayout.astro` — shared by blog posts and project posts; accepts both image shapes, renders OG image via `getImage` with `inferSize: true` for remote URLs
- Content grid uses Kevin Powell's breakout grid (`web/src/styles/index.scss`) with named columns: `content` (default), `breakout`, `full-width`

### Styling

- Custom SCSS with CSS custom properties — no CSS framework
- **OKLCH color space** for theme variables (`web/src/styles/theme.scss`) with dark/light modes controlled by `data-color-scheme` on `<html>`. Relative OKLCH (`oklch(from ... calc(...))`) is used extensively for derived colors
- Icons via Remix Icon (`remixicon` package), referenced as `<span class="ri-icon-name">` classes
- Typography: Plus Jakarta Sans (body, self-hosted) and JetBrains Mono (code, self-hosted) — both in `web/public/fonts/`
- Component-scoped `<style>` blocks; global styles via `<style is:global>` in Base layout

### Path Aliases (web/tsconfig.json)

- `@/*` → `web/src/*`
- `@components/*`, `@layouts/*`, `@styles/*`, `@scripts/*`, `@pages/*`, `@assets/*` → their `web/src/*` subdirs
- `@content/*` → `web/content/*` (note: **outside** `src/`). Moved here after the content reorg; several Svelte files previously used `@/content/...` which resolves to `src/content/...` and will break.

### Interactive Features

- **Theme toggle**: View Transition API with circular reveal from button origin, persisted via localStorage. AppBar's `viewTransitionName` is temporarily `'none'` during theme transitions, then restored
- **AppBar**: Scroll-triggered hide (100px delta) + Intersection Observer on `#scroll-sentinel` for floating state; persists across navigation via `transition:persist`. Sets `data-appbar-hidden` on `<html>` for other components to read (DirectoryFields adjusts sticky `top`)
- **Drawer**: Mobile nav via `mobileMenuState`. Toggles `data-active-scroll` on `<html>` to lock body scroll
- **Scroll animations**: `data-scroll-animate` elements get a `visible` class via Intersection Observer (`initScrollAnimations.ts`), re-initialized on each `astro:page-load`
- **Particle background**: Canvas + requestAnimationFrame, pauses when hero is out of viewport
- **View transitions**: ClientRouter with custom slide/fade animations (`customTransitions.ts`, `transitions.scss`). Scroll position is persisted in `history.state` and restored during `astro:after-swap`

### Search System

Client-side Fuse.js, three layers:

1. **Index endpoint** (`web/src/pages/search.json.ts`) — builds a flat JSON index of non-archived entries from `blog`, `guides`, `frontendProjects`. The `isPublic` filter still checks `data.public !== false && data.archived !== true`; for Payload-sourced blog posts `public` is undefined (truthy-wise passes) since Payload's publish state already filtered them at load time
2. **Search logic** (`web/src/scripts/search/`) — `search.ts` fetches `/search.json` lazily on first query, instantiates Fuse with `fuseOptions.ts`, drives results UI including client-side pagination and `?q=`/`?page=` URL sync. `resultTemplate.ts` is a plain string template (not an Astro component)
3. **Search page** (`web/src/pages/search/index.astro`) — static page whose `<script>` imports `search.ts` and wires up on `astro:page-load`

### Shared Type Registry

`web/src/scripts/types.ts` is the single source of truth for shared const enums: `Status`, `Collection`, `btnVariant`, `btnStyle`, `btnIconPos`, `ColorScheme`. Update here when adding new variants — the content collection schema in `content.config.ts` imports `Status` directly.

### Breadcrumb

`BreadCrumb.astro` auto-generates from `Astro.url.pathname` — not data-driven. Used on directory/listing pages; suppressed on the search page.

### Cross-Framework Communication

Astro and Svelte components coordinate via `data-*` attributes on `<html>`:

- `data-color-scheme` — `'dark'` | `'light'`, drives all theme CSS
- `data-appbar-hidden` — set by AppBar Svelte component, read by CSS in other components
- `data-active-scroll` — set by drawer utils, controls body `overflow-y`

## Architecture (cms/)

Payload 3 + Next.js 16 + MongoDB. Relevant pieces when coordinating with the frontend:

- **Posts** (`cms/src/collections/Posts/index.ts`) — the schema the Astro `blog` loader consumes. Top-level: `title`, `description`, `featured`, `archived`, `publishedAt`, `slug`. Tabs: Content (heroImage, Lexical content with Banner/Code/MediaBlock features), Meta (relatedPosts, categories, tags), SEO (plugin-seo overview/title/image/description). Drafts + autosave + schedulePublish are enabled.
- **Categories**, **Tags** — taxonomy collections (title + slug). Tags was added alongside the Astro integration; both are `relationship hasMany` from Posts.
- **Media** (`cms/src/collections/Media.ts`) — uploads written to `cms/public/media/` (publicly accessible via the Next.js app), with a predefined set of `imageSizes` (`thumbnail`, `square`, `small`, `medium`, `large`, `xlarge`, `og`). The `alt` field on Media is what the Astro loader maps to `coverAlt`.
- **Blocks** (`cms/src/blocks/`) — Banner, Code (language select + code field), MediaBlock. The Lexical renderer on the Astro side dispatches on `fields.blockType`; keep names in sync when adding blocks.
- **Plugins** (`cms/src/plugins/index.ts`) — form-builder, nested-docs (categories), redirects (pages + posts), seo, search. The search plugin is Payload-side and separate from the frontend Fuse.js search.

When adding fields to `Posts` that the frontend consumes: update the Zod schema in `web/src/content.config.ts`, the mapper in `web/src/loaders/payloadPostsLoader.ts`, and run `astro sync` + Payload `generate:types`.
