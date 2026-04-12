# Austin Hagel's Personal Website - 2026

## About

This is the frontend for my personal site. It will also be used as a template for other sites I plan on making, too.

Content is stored within this repo as markdown files in `src/content/`, validated with Zod schemas. Three content collections exist — **blog**, **guides**, and **frontend projects** — each with co-located cover images. Navigation links are driven by JSON configs (`internalLinks.json`, `externalLinks.json`). I plan to keep content separate in the future, likely with a CMS such as [Payload](https://payloadcms.com/).

## Technology

| Tool                          | Version | Role                                                            |
| :---------------------------- | :------ | :-------------------------------------------------------------- |
| [Astro](https://astro.build)  | 6       | Static site generation, file-based routing, content collections |
| [Svelte](https://svelte.dev)  | 5       | Interactive components using runes (`$state`, `$props`)         |
| [Sass](https://sass-lang.com) | —       | Custom SCSS theming with CSS custom properties                  |

Notable design choices:

- **OKLCH color space** for theme variables with dark/light mode support
- **View Transitions API** for page and theme-toggle animations (circular reveal from button origin)
- **No CSS framework** — fully custom styles
- **Dark/light favicons** that update dynamically with the color scheme

## Prerequisites

- Node.js **>=22.12.0**
- npm

## Project Structure

```
src/
├── components/
│   ├── cards/             # BlogCard, FrontendProjectCard and their content sub-components
│   ├── drawer-mobile-nav/ # Mobile drawer navigation (DrawerMobileMenu, DrawerMobileNav, DrawerMobileNavLink)
│   ├── home-sections/     # Home page sections (Hero, About, Blog, Projects, Links)
│   ├── state/             # Shared Svelte state modules (appBarState, mobileMenuState)
│   └── ...                # AppBar, Navigation, Paginator, Tabs, DirectoryHero, SearchBar, etc.
├── content/
│   ├── blog/         # Blog posts (Markdown with co-located cover images)
│   ├── guides/       # Guides & tutorials
│   └── projects/
│       └── frontend/ # Frontend project write-ups
├── layouts/
│   ├── Base.astro      # Base layout (AppBar, Drawer, Footer, scroll restoration, meta)
│   ├── CommonHead.astro # <head> fragment (meta, favicons, ClientRouter, theme init script)
│   ├── Directory.astro # Reusable paginated listing with sidebar fields
│   └── Taxonomy.astro  # Listing for taxonomy terms (categories, tags)
├── pages/            # File-based routes (see Routing below)
├── scripts/          # Client-side TypeScript (view transitions, scroll animations, utils)
└── styles/           # Global SCSS, theme variables, transitions, reset
public/
└── fonts/            # Self-hosted Plus Jakarta Sans
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
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

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
- [ ] Search
  - [x] Search bar UI
  - [ ] Functional search
  - [ ] Search results page
- [ ] Contact
  - [ ] Contact form UI
  - [ ] Functional contact form (submission handling)

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
  - [ ] Sorting & filtering
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

### Future

- [ ] Implement a CMS (Looking at [Payload](https://payloadcms.com/))
- [ ] Guides collection pages

## License

[MIT](LICENSE) — free to use, modify, and distribute, including commercially.

## Attributions

Please check the [Attributions Document](ATTRIBUTIONS.md) to view the resources used to make this project possible.

## Documentation

- [Astro](https://docs.astro.build)
- [Svelte](https://svelte.dev/docs)
- [Sass](https://sass-lang.com/documentation/)
