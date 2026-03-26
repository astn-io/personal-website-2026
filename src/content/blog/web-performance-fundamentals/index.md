---
title: 'Web Performance Fundamentals'
description: 'Core Web Vitals explained, the highest-leverage optimizations for most sites, and how to measure what actually matters.'
pubDate: 2026-03-12
coverImage: ./pexels-chuotanhls-17881368.jpg
coverAlt: A woman with hair blowing in the wind standing on a rooftop with a city skyline behind her
---

# Web Performance Fundamentals

Performance optimization has a bad reputation for being a rabbit hole. It can be, but for most sites, a handful of fundamentals get you 90% of the way there.

## The Metrics That Matter

Google's Core Web Vitals are a reasonable proxy for user experience:

- **LCP (Largest Contentful Paint)** — how fast the main content loads. Target: under 2.5s.
- **INP (Interaction to Next Paint)** — how quickly the page responds to input. Target: under 200ms.
- **CLS (Cumulative Layout Shift)** — how much the layout jumps unexpectedly. Target: under 0.1.

## LCP: The Most Impactful

Your LCP element is usually a hero image or heading. To improve it:

**Preload your hero image:**

```html
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />
```

**Use `fetchpriority="high"` on the LCP image element itself:**

```html
<img src="/hero.webp" fetchpriority="high" alt="..." />
```

**Self-host your fonts.** Google Fonts adds a render-blocking round trip. Download the font files and serve them yourself with `font-display: swap`.

## CLS: Easier Than It Looks

Most CLS problems have one of two causes:

1. Images without explicit dimensions
2. Fonts swapping after layout

Fix:

```html
<!-- Always set width and height -->
<img src="photo.jpg" width="800" height="600" alt="..." />
```

```css
/* font-display: optional is even better for CLS than swap */
@font-face {
  font-family: 'My Font';
  font-display: optional;
}
```

## INP: The Tricky One

INP replaced FID and is harder to improve. The main causes:

- Long tasks blocking the main thread (JavaScript)
- Heavy event handlers

Break long tasks with `scheduler.yield()` (or `setTimeout(fn, 0)` as a fallback):

```javascript
async function processItems(items) {
  for (const item of items) {
    process(item);
    await scheduler.yield(); // yield between items
  }
}
```

## Measure First

DevTools Lighthouse is a starting point. Real user data from the Chrome User Experience Report (CrUX) is what actually matters.

Don't optimize blindly. Find your actual bottleneck, fix it, measure again.
