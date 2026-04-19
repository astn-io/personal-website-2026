# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Preview production build locally
- No test runner or linter configured
- Node >=22.12.0 required

## CMS/Payload CMS

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Architecture

**Astro 6 + Svelte 5 static site** with file-based routing, content collections, and custom SCSS theming.

### Component Split

- **Astro components** (`.astro`): layouts, pages, sections, structural/static elements (ParticleBackground, VideoBackground, Footer, FeaturedLinks)
- **Svelte components** (`.svelte`): interactive elements using Svelte 5 runes (`$state()`, `$props()`) — AppBar, Navigation, Button, LightToggle
- **Shared Svelte state** (`src/components/state/`): module-level `$state()` runes for cross-component state (e.g., `appBarState.svelte.ts`, `mobileMenuState.svelte.ts`)

### Routing & Content

- Pages live in `src/pages/` with Astro file-based routing (e.g., `blog/[id].astro` for dynamic routes)
- Three content collections defined in `src/content.config.ts`: `blog`, `guides`, and `frontendProjects` — all use glob loaders with Zod schema validation
- Blog posts live in `src/content/blog/<slug>/index.md` with a co-located cover image; frontend projects in `src/content/projects/frontend/<slug>/index.md`
- The `frontendProjects` collection has extra fields: `status` (enum from `src/scripts/types.ts`), `repositoryUrl`, `demoUrl`, `frontendmentorUrl`
- Navigation and external links are JSON-driven configs in `src/content/` (`internalLinks.json`, `externalLinks.json`)

### Layout System

- `src/layouts/CommonHead.astro` — `<head>` fragment with meta tags, favicon links, ClientRouter, and an inline `<script is:inline>` that initializes the theme before first paint (prevents flash). Exposes `window.updateFavicons()` globally for the LightToggle
- `src/layouts/Base.astro` — base layout wrapping all pages; composes CommonHead, AppBar (persisted via `transition:persist`), Drawer (mobile menu), Footer, scroll position restoration, and scroll animation init
- `src/layouts/Directory.astro` — reusable paginated listing layout used by blog and projects; composes DirectoryHero, DirectoryFields (categories/tags sidebar), card lists, and Paginator
- `src/layouts/Taxonomy.astro` — grid layout for category/tag index pages (e.g., `/blog/categories/`, `/blog/tags/`), with staggered scroll-reveal animations
- Content grid uses Kevin Powell's breakout grid technique (defined in `src/styles/index.scss`) with named grid columns: `content` (default), `breakout`, and `full-width`

### Styling

- Custom SCSS with CSS custom properties — no CSS framework
- **OKLCH color space** for theme variables (`src/styles/theme.scss`) with dark/light modes controlled by `data-color-scheme` attribute on `<html>`. Relative OKLCH (`oklch(from ... calc(...))`) is used extensively in component styles for derived colors
- Icons via Remix Icon (`remixicon` package), referenced as `<span class="ri-icon-name">` classes
- Typography: Plus Jakarta Sans (body, self-hosted) and JetBrains Mono (code, self-hosted) — both in `/public/fonts/`
- Component-scoped styles via `<style>` blocks; global styles via `<style is:global>` in Base layout

### Path Aliases (tsconfig.json)

`@/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@scripts/*`, `@content/*`, `@pages/*`, `@assets/*` all resolve to their respective `src/` subdirectories.

### Interactive Features

- **Theme toggle**: View Transition API with circular reveal animation from button origin, persisted via localStorage. The AppBar's `viewTransitionName` is temporarily set to `'none'` during theme transitions so it doesn't animate, then restored after
- **AppBar**: Scroll-triggered hide (100px delta threshold) + Intersection Observer on a `#scroll-sentinel` for floating state, persists across navigation via `transition:persist`. Sets `data-appbar-hidden` attribute on `<html>` which other components read (e.g., DirectoryFields adjusts sticky `top`)
- **Drawer**: Mobile navigation menu controlled via `mobileMenuState`. Toggles `data-active-scroll` on `<html>` to lock/unlock body scroll
- **Scroll animations**: Elements with `data-scroll-animate` attribute get a `visible` class added via Intersection Observer (`src/scripts/initScrollAnimations.ts`), re-initialized on each `astro:page-load`
- **Particle background**: Canvas animation with requestAnimationFrame, pauses when hero is out of viewport (Intersection Observer)
- **View transitions**: Astro ClientRouter with custom slide/fade animations (`src/scripts/customTransitions.ts`, `src/styles/transitions.scss`). Scroll position is persisted in `history.state` and restored during `astro:after-swap` to prevent visual snapping

### Search System

Search is entirely client-side using Fuse.js. The pipeline has three layers:

1. **Index endpoint** (`src/pages/search.json.ts`) — Astro API route that builds a flat JSON index of all public, non-archived entries from all three collections at build time. Entries with `public: false` or `archived: true` are excluded. Served at `/search.json`.
2. **Search logic** (`src/scripts/search/`) — `search.ts` fetches `/search.json` lazily on first query, instantiates a Fuse instance with `fuseOptions.ts`, and drives the results UI including client-side pagination and `?q=`/`?page=` URL sync. `resultTemplate.ts` is a plain string template function for result cards (not an Astro component).
3. **Search page** (`src/pages/search/index.astro`) — static Astro page; the `<script>` tag imports `search.ts` which wires everything up on `astro:page-load`.

The `public` and `archived` frontmatter flags apply to all collections and control search index inclusion. There is no other gating mechanism.

### Code Block Pipeline

Fenced code blocks in Markdown are rendered by Astro's built-in Shiki integration using the custom theme at `src/styles/shiki-theme.json`. After rendering, `initCodeCopy.ts` (called from `Base.astro` on each `astro:page-load`) post-processes `.astro-code` elements to:

- Add a `.code-block-wrapper` div around each block and inject a language badge (`<button class="code-copy-badge">`) that copies the full block to the clipboard on click
- Attach per-line click handlers that copy that line's text to the clipboard

All visual styles for this are in `src/styles/code.scss`. Inline `<code>` (not inside `<pre>`) is also styled there.

### Shared Type Registry

`src/scripts/types.ts` is the single source of truth for shared const enums: `Status` (project statuses), `Collection` (collection names), `btnVariant`, `btnStyle`, `btnIconPos`, `ColorScheme`. Always update this file when adding new variants to any of these — the content collection schema (`src/content.config.ts`) imports `Status` from here directly.

### Breadcrumb

`BreadCrumb.astro` auto-generates breadcrumbs purely from `Astro.url.pathname` — it is not data-driven. It is used in directory/listing pages and is suppressed on the search page.

### Cross-Framework Communication

Astro and Svelte components coordinate via `data-*` attributes on `<html>`:

- `data-color-scheme` — `'dark'` | `'light'`, drives all theme CSS
- `data-appbar-hidden` — set by AppBar Svelte component, read by CSS in other components
- `data-active-scroll` — set by drawer utils, controls body `overflow-y`
