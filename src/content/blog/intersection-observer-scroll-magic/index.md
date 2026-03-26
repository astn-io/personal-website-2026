---
title: 'Intersection Observer: Scroll Magic Without the Jank'
description: "How the Intersection Observer API works, why it's better than scroll event listeners, and three patterns I use all the time."
pubDate: 2026-01-15
---

# Intersection Observer: Scroll Magic Without the Jank

For years, the way to do anything scroll-based was to listen to the `scroll` event and calculate positions with `getBoundingClientRect()`. It worked, but it fired constantly, blocked the main thread, and caused layout thrash.

The Intersection Observer API is the right answer. Here's how to use it well.

## How It Works

You create an observer, pass it a callback, and tell it which elements to watch. The callback fires whenever a watched element enters or leaves a threshold:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
  observer.observe(el);
});
```

The key: the browser calls your callback asynchronously, off the main thread's critical path. No jank.

## Pattern 1: Lazy Pause Animations

I use this on canvas animations to avoid running them when they're offscreen:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting }) => {
    isIntersecting ? startAnimation() : stopAnimation();
  });
});

observer.observe(canvasElement);
```

## Pattern 2: Floating AppBar

Detecting when the user has scrolled past the hero is a natural fit:

```javascript
const sentinel = document.querySelector('#hero-sentinel');

const observer = new IntersectionObserver(([entry]) => {
  appBar.classList.toggle('floating', !entry.isIntersecting);
});

observer.observe(sentinel);
```

## Pattern 3: Infinite Scroll Trigger

Instead of listening for scroll position, observe a sentinel element at the bottom of your list:

```javascript
const loadMoreObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    loadNextPage();
  }
});

loadMoreObserver.observe(document.querySelector('#list-end'));
```

## Cleanup

Always disconnect your observer when it's no longer needed — especially in Svelte or React components:

```javascript
// Svelte 5
$effect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(target);
  return () => observer.disconnect();
});
```

That's it. Replace your scroll listeners with IntersectionObserver and your performance metrics will thank you.
