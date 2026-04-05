# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Preview production build locally
- No test runner or linter configured
- Node >=22.12.0 required

## Architecture

**Astro 6 + Svelte 5 static site** with file-based routing, content collections, and custom SCSS theming.

### Component Split

- **Astro components** (`.astro`): layouts, pages, sections, structural/static elements (ParticleBackground, VideoBackground, Footer, FeaturedLinks)
- **Svelte components** (`.svelte`): interactive elements using Svelte 5 runes (`$state()`, `$props()`) — AppBar, Navigation, Button, LightToggle

### Routing & Content

- Pages live in `src/pages/` with Astro file-based routing (e.g., `blog/[id].astro` for dynamic routes)
- Three content collections defined in `src/content.config.ts`: `blog`, `guides`, and `frontendProjects` — all use glob loaders with Zod schema validation
- Blog posts live in `src/content/blog/<slug>/index.md` with a co-located cover image; frontend projects in `src/content/projects/frontend/<slug>/index.md`
- The `frontendProjects` collection has extra fields: `status` (enum from `src/scripts/types.ts`), `repositoryUrl`, `demoUrl`, `frontendmentorUrl`
- Navigation and external links are JSON-driven configs in `src/content/` (`internalLinks.json`, `externalLinks.json`)

### Layout System

- `src/layouts/Base.astro` — base layout wrapping all pages with Astro ClientRouter, AppBar (persisted via `transition:persist`), scroll position restoration, global styles, and meta tags
- `src/layouts/Directory.astro` — reusable paginated listing layout used by blog and projects; composes DirectoryHero, DirectoryFields (categories/tags sidebar), card lists, and Paginator
- Content grid uses Kevin Powell's breakout grid technique (defined in `src/styles/index.scss`) with named grid columns: `content` (default), `breakout`, and `full-width`

### Styling

- Custom SCSS with CSS custom properties — no CSS framework
- **OKLCH color space** for theme variables (`src/styles/theme.scss`) with dark/light modes controlled by `data-color-scheme` attribute on `<html>`. Relative OKLCH (`oklch(from ... calc(...))`) is used extensively in component styles for derived colors
- Icons via Remix Icon (`remixicon` package), referenced as `<span class="ri-icon-name">` classes
- Typography uses Plus Jakarta Sans (self-hosted in `/public/fonts/`)
- Component-scoped styles via `<style>` blocks; global styles via `<style is:global>` in Base layout

### Path Aliases (tsconfig.json)

`@/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@scripts/*`, `@content/*`, `@pages/*`, `@assets/*` all resolve to their respective `src/` subdirectories.

### Interactive Features

- **Theme toggle**: View Transition API with circular reveal animation from button origin, persisted via localStorage
- **AppBar**: Scroll-triggered hide (140px threshold) + Intersection Observer for floating state, persists across navigation via `transition:persist`. Sets `data-appbar-hidden` attribute on `<html>` which other components read (e.g., DirectoryFields adjusts sticky `top`)
- **Scroll animations**: Elements with `data-scroll-animate` attribute get a `visible` class added via Intersection Observer (`src/scripts/initScrollAnimations.ts`), re-initialized on each `astro:page-load`
- **Particle background**: Canvas animation with requestAnimationFrame, pauses when hero is out of viewport (Intersection Observer)
- **View transitions**: Astro ClientRouter with custom slide/fade animations (`src/scripts/customTransitions.ts`, `src/styles/transitions.scss`). Scroll position is persisted in `history.state` and restored during `astro:after-swap` to prevent visual snapping
