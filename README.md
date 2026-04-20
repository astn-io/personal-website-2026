# Austin Hagel's Personal Website - 2026

## About

This is my personal site, organized as a pnpm monorepo with an Astro frontend (`web/`) and a [Payload CMS](https://payloadcms.com/) instance (`cms/`). It also serves as a template for other sites I plan on making.

Blog posts and frontend projects are authored in the Payload admin UI and fetched at build/dev time via custom Astro content loaders. Guides are still backed by local Markdown under `web/src/content/guides/` pending migration. Navigation links live as JSON under `web/content/internal-links/` and `web/content/external-links/`. The site also has a commenting and voting system backed by Payload, and a contact form that submits to a Payload collection.

## Technology

| Tool                               | Version | Role                                                                                                       |
| :--------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------- |
| [Astro](https://astro.build)       | 6       | Site generation, file-based routing, content collections, Node SSR adapter                                 |
| [Svelte](https://svelte.dev)       | 5       | Interactive components using runes (`$state`, `$props`)                                                    |
| [Payload](https://payloadcms.com/) | 3       | Headless CMS for posts, frontend projects, comments, votes, contact messages (Next.js app, MongoDB-backed) |
| [Sass](https://sass-lang.com)      | —       | Custom SCSS theming with CSS custom properties                                                             |
| [Fuse.js](https://fusejs.io)       | 7       | Client-side fuzzy search across content collections                                                        |

Notable design choices:

- **OKLCH color space** for theme variables with dark/light mode support
- **View Transitions API** for page and theme-toggle animations (circular reveal from button origin)
- **No CSS framework** — fully custom styles
- **Dark/light favicons** that update dynamically with the color scheme
- **Code blocks** with a custom Shiki theme, per-line copy on click, and a language badge with full-block copy
- **Custom Lexical renderer** in `web/src/components/lexical/` converts Payload's rich text JSON into Astro components, keeping Payload code blocks on the same Shiki pipeline as the rest of the site
- **Custom Astro content loaders** — `payloadPostsLoader.ts` and `payloadFrontendProjectsLoader.ts` pull published content from Payload's REST API and map it into Zod-validated schemas
- **Commenting system** — anonymous comments with auto-generated adjective+noun display names (stored in localStorage), moderated via Payload admin. Up/downvoting tracks votes by UUID per browser with deduplication enforced server-side

## Prerequisites

- Node.js **>=22.12.0**
- pnpm **^9 || ^10**
- MongoDB (local instance or connection string for the `cms/` package — see `cms/docker-compose.yml` for a quick local setup)

## Project Structure

The repo is a pnpm workspace with two packages:

```
.
├── web/        # Astro frontend
└── cms/        # Payload CMS (Next.js app + MongoDB)
```

### `web/` — Astro frontend

```
web/
├── content/                # JSON-driven nav configs (internalLinks, externalLinks)
├── src/
│   ├── components/
│   │   ├── cards/             # BlogCard, FrontendProjectCard and their content sub-components
│   │   ├── drawer-mobile-nav/ # Mobile drawer navigation
│   │   ├── home-sections/     # Home page sections (Hero, About, Blog, Projects, Links)
│   │   ├── lexical/           # Payload Lexical → Astro renderer (CodeBlock, BannerBlock, MediaBlock, TextNode, ...)
│   │   ├── state/             # Shared Svelte state modules (appBarState, mobileMenuState)
│   │   └── ...                # AppBar, Navigation, Paginator, Tabs, SearchBar, etc.
│   ├── layouts/               # Base, CommonHead, Directory, Taxonomy, PostLayout
│   ├── loaders/
│   │   ├── payloadPostsLoader.ts            # Custom Astro content loader fetching posts from Payload REST API
│   │   └── payloadFrontendProjectsLoader.ts # Custom Astro content loader fetching frontend projects from Payload REST API
│   ├── pages/                 # File-based routes (see Routing below)
│   ├── scripts/
│   │   ├── search/               # Fuse.js search logic (fuseOptions, search, resultTemplate)
│   │   ├── comments/             # Comment system helpers (commentStorage: localStorage name/voter-ID/vote cache, markdown: renderer)
│   │   ├── initCodeCopy.ts       # Per-line and full-block clipboard copy for code blocks
│   │   ├── initScrollAnimations.ts
│   │   ├── customTransitions.ts
│   │   └── ...                   # drawerUtils, fieldDataUtils, slugify, types
│   └── styles/
│       ├── code.scss             # Code block styles (Shiki output, badges, copy interactions)
│       ├── shiki-theme.json      # Custom Shiki syntax-highlight theme
│       ├── theme.scss            # OKLCH color tokens, dark/light modes
│       ├── transitions.scss      # View transition animations
│       └── ...                   # index, reset, variables, fonts, search
└── public/
    └── fonts/
        ├── plus-jakarta-sans/    # Self-hosted Plus Jakarta Sans (body text)
        └── jetbrains-mono/       # Self-hosted JetBrains Mono (code blocks)
```

### `cms/` — Payload CMS

```
cms/
├── docker-compose.yml       # Local MongoDB for development
└── src/
    ├── access/              # Access control helpers (authenticated, anyone, authenticatedOrPublished)
    ├── blocks/              # Lexical block configs (Banner, Code, MediaBlock) rendered by web/
    ├── collections/
    │   ├── Posts/               # Blog posts — mirrors the Astro blog schema
    │   ├── FrontendProjects/    # Frontend projects — mirrors the Astro frontendProjects schema (+ images, status, links)
    │   ├── Comments.ts          # Moderated comments; public create, approved-only public read
    │   ├── Votes.ts             # Per-comment up/downvotes tracked by voter UUID
    │   ├── ContactMessages.ts   # Contact form submissions; public create, admin-only read
    │   ├── Categories.ts
    │   ├── Tags.ts
    │   ├── Media.ts
    │   └── Users.ts
    ├── Header/, Footer/     # Globals
    └── payload.config.ts
```

### Routing

```
/                           Home
/about                      About page
/blog/                      Blog directory (paginated)
/blog/[id]                  Individual blog post
/blog/categories/           All blog categories
/blog/categories/[category] Posts filtered by category (paginated)
/blog/tags/                 All blog tags
/blog/tags/[tag]            Posts filtered by tag (paginated)
/projects/                  Projects index
/projects/frontend/         Frontend projects directory (paginated)
/projects/frontend/[id]     Individual frontend project
/projects/frontend/categories/              All frontend project categories
/projects/frontend/categories/[category]    Projects filtered by category (paginated)
/projects/frontend/tags/                    All frontend project tags
/projects/frontend/tags/[tag]               Projects filtered by tag (paginated)
/search                     Search page (fuzzy search via Fuse.js, paginated results)
```

## Commands

Run from the repo root unless noted. The Astro blog loader fetches from Payload at dev/build time, so start the CMS first if you want posts to show up.

| Command        | Action                                                 |
| :------------- | :----------------------------------------------------- |
| `pnpm install` | Install dependencies for both packages                 |
| `pnpm dev`     | Start both `web` and `cms` dev servers in parallel     |
| `pnpm dev:web` | Start only the Astro dev server at `localhost:4321`    |
| `pnpm dev:cms` | Start only the Payload admin at `localhost:3000/admin` |
| `pnpm build`   | Build both packages                                    |
| `pnpm lint`    | Run lint in packages that define it                    |

The Astro loader reads `PAYLOAD_URL` (falls back to `NEXT_PUBLIC_SERVER_URL`, then `http://localhost:3000`) to locate the Payload API. `astro.config.mjs` derives `image.remotePatterns` from the same URL so `astro:assets` can optimize Payload-hosted media.

Inside `cms/`, useful Payload commands include `pnpm payload generate:types` (regenerate `payload-types.ts` after schema changes) and `pnpm payload migrate` (run database migrations).

## Roadmap

### Core

- [x] AppBar with floating style and auto-hiding
- [x] Dark/Light Mode & Toggle
- [x] View Transitions
  - [x] Light Mode Toggle transition
  - [x] Page transitions
- [x] Scroll-triggered reveal animations
- [x] Mobile Drawer (navigation, light toggle, featured links, contact button)
- [x] Responsive Layout
- [x] Navigation progress bar
- [x] Breadcrumb navigation
- [ ] Search
  - [x] Search bar UI
  - [-] Functional search (Fuse.js, client-side) _(Note: no longer working since integration Payload CMS. Need a new solution now.)_
  - [ ] Migrate searching from using Fuse.js to retrieving data from Payload CMS
  - [x] Search results page (paginated)
- [x] Contact
  - [x] Contact form UI (modal dialog with honeypot)
  - [x] Functional contact form (submits to Payload `contact-messages` collection)

### Pages

- [x] Complete 'Home' page
  - [x] Hero section
    - [x] Video Background
    - [x] Floating Particles Effect Background
    - [x] Social Links
  - [x] About section
  - [x] Featured Posts section
  - [x] Featured Projects section
  - [x] External Links section
- [x] Complete 'About' page
  - [x] Intro section
  - [x] Story section
  - [x] Expertise section
  - [x] Philosophy section
  - [x] Connect section
- [x] Routes for collections
  - [x] Pagination
  - [x] Categories view (directory + filtered listing)
  - [x] Tags view (directory + filtered listing)
  - [x] Featured items on first page
  - [ ] Sorting & filtering on directory pages
- [x] Complete 'Blog' page
- [ ] Complete 'Projects' page
  - [x] Projects index (list of project collections)
  - [x] Frontend projects (personal + [Frontend Mentor](https://www.frontendmentor.io/))
  - [ ] Graphic Design projects
  - [ ] Backend projects
  - [ ] 3D Modeling/Animation projects
- [ ] Archive pages
  - [ ] Blog archive
  - [ ] Projects archive

### CMS

- [x] Integrate [Payload](https://payloadcms.com/) as the headless CMS (monorepo layout, shared types)
- [x] Blog posts sourced from Payload via a custom Astro content loader
- [x] Lexical rich-text renderer that preserves the Astro Shiki pipeline for code blocks
- [x] Commenting system (moderated via Payload, anonymous names, up/downvoting)
- [x] Contact form submissions stored in Payload
- [ ] Migrate the existing Markdown blog posts into Payload
- [x] Move Frontend Projects into Payload
- [ ] Move Guides into Payload

### Future

- [ ] Guides collection pages
- [ ] Share button/link for posts

## License

[MIT](LICENSE) — free to use, modify, and distribute, including commercially.

## Attributions

Please check the [Attributions Document](ATTRIBUTIONS.md) to view the resources used to make this project possible.

## Documentation

- [Astro](https://docs.astro.build)
- [Svelte](https://svelte.dev/docs)
- [Sass](https://sass-lang.com/documentation/)
