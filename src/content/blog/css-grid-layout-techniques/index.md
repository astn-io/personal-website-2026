---
title: 'CSS Grid Layout Techniques Worth Knowing'
description: 'A handful of CSS Grid patterns that go beyond the basics, including the breakout grid, auto-fill vs auto-fit, and subgrid.'
pubDate: 2026-02-10
---

# CSS Grid Layout Techniques Worth Knowing

CSS Grid is mature and well-supported, but a lot of developers still use it like a slightly fancier flexbox. Here are some techniques that unlock its real power.

## The Breakout Grid

Kevin Powell popularized this pattern for full-bleed sections within a centered layout. The idea: define named column tracks so any child can opt into full-width without breaking the layout.

```css
.content-grid {
  --padding-inline: 1.5rem;
  --content-max-width: 70ch;
  --breakout-max-width: 90ch;

  --breakout-size: calc(
    (var(--breakout-max-width) - var(--content-max-width)) / 2
  );

  display: grid;
  grid-template-columns:
    [full-width-start]
    minmax(var(--padding-inline), 1fr)
    [breakout-start]
    minmax(0, var(--breakout-size))
    [content-start]
    min(100% - (var(--padding-inline) * 2), var(--content-max-width))
    [content-end]
    minmax(0, var(--breakout-size))
    [breakout-end]
    minmax(var(--padding-inline), 1fr)
    [full-width-end];
}

.content-grid > * {
  grid-column: content;
}

.breakout {
  grid-column: breakout;
}

.full-width {
  grid-column: full-width;
}
```

Everything is centered by default. Apply `.breakout` or `.full-width` to escape it.

## `auto-fill` vs `auto-fit`

Both create as many columns as can fit, but they differ when there aren't enough items to fill a row:

- `auto-fill` keeps empty columns, maintaining their width
- `auto-fit` collapses empty columns so existing items can expand

```css
/* Items grow to fill empty space */
.auto-fit-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Items stay fixed-width, empty space remains */
.auto-fill-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

Usually you want `auto-fit`.

## Subgrid

Subgrid lets nested elements align to the parent grid — the long-awaited fix for card alignment problems:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid; /* aligns to parent rows */
}
```

Now every card's title, body, and footer align across the row regardless of content length.

Subgrid has excellent browser support now. Use it.
