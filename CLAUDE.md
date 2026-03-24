# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start dev server (localhost:4321)
- `npm run build` — Production build to `./dist/`
- `npm run preview` — Preview production build locally
- Node >=22.12.0 required

## Architecture

**Astro 6 + Svelte 5 static site** with file-based routing, content collections, and custom SCSS theming.

### Component Split

- **Astro components** (`.astro`): layouts, pages, sections, structural/static elements (ParticleBackground, VideoBackground, Footer, SocialLinks)
- **Svelte components** (`.svelte`): interactive elements using Svelte 5 runes (`$state()`, `$props()`) — AppBar, Navigation, Button, LightToggle

### Routing & Content

- Pages live in `src/pages/` with Astro file-based routing (e.g., `blog/[id].astro` for dynamic routes)
- Blog posts use Astro Content Collections with Zod schema validation (`src/content/blog/`, `src/content.config.ts`)
- Navigation and external links are JSON-driven configs in `src/content/` (`internalLinks.json`, `externalLinks.json`)

### Layout System

- `src/layouts/Base.astro` is the single base layout wrapping all pages with Astro ClientRouter, AppBar, global styles, and meta tags
- Content grid uses Kevin Powell's breakout grid technique (defined in `src/styles/index.scss`)

### Styling

- Custom SCSS with CSS custom properties — no CSS framework
- **OKLCH color space** for theme variables (`src/styles/theme.scss`) with dark/light modes controlled by `data-color-scheme` attribute on `<html>`
- Typography uses Plus Jakarta Sans (self-hosted in `/public/fonts/`)
- Component-scoped styles via `<style>` blocks; global styles via `<style is:global>` in Base layout

### Path Aliases (tsconfig.json)

`@/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@scripts/*`, `@content/*`, `@pages/*`, `@assets/*` all resolve to their respective `src/` subdirectories.

### Interactive Features

- **Theme toggle**: View Transition API with circular reveal animation from button origin, persisted via localStorage
- **AppBar**: Scroll-triggered hide (140px threshold) + Intersection Observer for floating state, persists across navigation via `transition:persist`
- **Particle background**: Canvas animation with requestAnimationFrame, pauses when hero is out of viewport (Intersection Observer)
- **View transitions**: Astro ClientRouter with custom slide/fade animations (`src/scripts/customTransitions.ts`, `src/styles/transitions.scss`)
