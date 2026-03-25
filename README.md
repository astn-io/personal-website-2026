# Austin Hagel's Personal Website - 2026

## About

This is the frontend for my personal site. It will also be used as a template for other sites I plan on making, too.

Content is currently stored within this repo as markdown files in `src/content/`, validated with Zod schemas. Blog posts live in `src/content/blog/` and navigation links are driven by JSON configs. I plan to keep content separate in the future, likely with a CMS such as [Payload](https://payloadcms.com/).

## Technology

| Tool | Version | Role |
| :--- | :------ | :--- |
| [Astro](https://astro.build) | 6 | Static site generation, file-based routing, content collections |
| [Svelte](https://svelte.dev) | 5 | Interactive components using runes (`$state`, `$props`) |
| [Sass](https://sass-lang.com) | — | Custom SCSS theming with CSS custom properties |

Notable design choices:
- **OKLCH color space** for theme variables with dark/light mode support
- **View Transitions API** for page and theme-toggle animations
- **No CSS framework** — fully custom styles

## Prerequisites

- Node.js **>=22.12.0**
- npm

## Project Structure

```
src/
├── components/       # Astro (.astro) and Svelte (.svelte) components
├── content/          # Markdown blog posts, JSON nav configs, Zod schema
├── layouts/          # Base.astro — single base layout for all pages
├── pages/            # File-based routes (index, blog/[id], etc.)
├── scripts/          # Client-side TypeScript (view transitions, etc.)
└── styles/           # Global SCSS, theme variables, transitions
public/
└── fonts/            # Self-hosted Plus Jakarta Sans
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
- [ ] Mobile Menu
- [ ] Responsive Layout
- [ ] Contact Button & Form

### Pages

- [ ] Complete 'Home' page
  - [x] Hero section
    - [x] Video Background
    - [x] Floating Particles Effect Background
    - [x] Social Links
  - [ ] About section
  - [ ] Featured Posts section
  - [ ] Featured Projects section
  - [ ] External Links (social media, etc.) section
- [ ] Complete 'About' page
- [ ] Routes for collections (blog posts, projects, etc.)
  - [ ] Pagination
  - [ ] Categories view
  - [ ] Tags view
  - [ ] Sorting & filtering
- [ ] Complete 'Blog' page
- [ ] Complete 'Projects' page
  - [ ] Project types
    - [ ] Frontend projects (personal + [Frontend Mentor](https://www.frontendmentor.io/))
    - [ ] Graphic Design projects
    - [ ] Backend projects
    - [ ] 3D Modeling/Animation projects

### Future

- [ ] Implement a CMS (Looking at [Payload](https://payloadcms.com/))

## License

[MIT](LICENSE) — free to use, modify, and distribute, including commercially.

## Documentation

- [Astro](https://docs.astro.build)
- [Svelte](https://svelte.dev/docs)
- [Sass](https://sass-lang.com/documentation/)
