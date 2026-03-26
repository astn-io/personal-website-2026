---
title: 'Dark Mode Done Right'
description: 'A complete approach to dark mode: respecting system preference, avoiding flash on load, persisting choices, and animating the transition.'
pubDate: 2026-02-25
---

# Dark Mode Done Right

Dark mode sounds simple until you actually implement it. Here's everything that needs to work together to get it right.

## The Four Requirements

1. **System preference** — respect `prefers-color-scheme` by default
2. **User override** — let users toggle and remember their choice
3. **No flash on load** — the page should render in the correct mode immediately
4. **Nice transition** — the switch should feel intentional, not jarring

## 1. The CSS Foundation

Use a `data-color-scheme` attribute on `<html>` as your styling hook, with a `prefers-color-scheme` fallback:

```css
:root {
  color-scheme: light dark;
}

:root,
[data-color-scheme='light'] {
  --bg: oklch(97% 0.01 260);
  --fg: oklch(20% 0.04 260);
}

[data-color-scheme='dark'] {
  --bg: oklch(18% 0.04 260);
  --fg: oklch(92% 0.01 260);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-color-scheme='light']) {
    --bg: oklch(18% 0.04 260);
    --fg: oklch(92% 0.01 260);
  }
}
```

The `:not([data-color-scheme='light'])` selector ensures a user's explicit light-mode choice is respected even in a dark OS environment.

## 2. No Flash on Load

Run a small inline script in `<head>` — before any CSS loads — to apply the stored preference:

```html
<script>
  const stored = localStorage.getItem('color-scheme');
  if (stored) {
    document.documentElement.dataset.colorScheme = stored;
  }
</script>
```

Inline, synchronous, tiny. No flash.

## 3. The Toggle

```javascript
function toggleTheme() {
  const current = document.documentElement.dataset.colorScheme;
  const isDark =
    current === 'dark' ||
    (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const next = isDark ? 'light' : 'dark';
  document.documentElement.dataset.colorScheme = next;
  localStorage.setItem('color-scheme', next);
}
```

## 4. The Transition

A crossfade is fine. A circular reveal from the button click is better. See my View Transitions API post for the full implementation.

The short version: `document.startViewTransition()` + `clip-path` animation on `::view-transition-new(root)`.

## Don't Forget

- Set `color-scheme` on `:root` so browser UI (scrollbars, inputs) respects the theme
- Test with JavaScript disabled — your CSS fallback should still work
- `localStorage` is synchronous and fast in `<head>`, but if you're using SSR, you may need a cookie instead
