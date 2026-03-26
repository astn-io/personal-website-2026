---
title: 'View Transitions API: A Practical Guide'
description: "The View Transitions API brings smooth page animations to the web platform. Here's how to use it well, including the circular reveal trick."
pubDate: 2025-12-09
---

# View Transitions API: A Practical Guide

The View Transitions API is one of my favorite recent additions to the web platform. With a few lines of CSS and JavaScript, you can create the kind of polished transitions that used to require a full animation library.

## The Basics

At its simplest, wrap a DOM mutation in `document.startViewTransition()`:

```javascript
document.startViewTransition(() => {
  document.querySelector('#content').innerHTML = newContent;
});
```

The browser automatically crossfades between the old and new state. That's already pretty nice.

## Custom Transitions with CSS

The real power comes from `view-transition-name` and the `::view-transition-*` pseudo-elements:

```css
::view-transition-old(root) {
  animation: slide-out 300ms ease-in forwards;
}

::view-transition-new(root) {
  animation: slide-in 300ms ease-out forwards;
}

@keyframes slide-out {
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
}
```

## The Circular Reveal Trick

For theme toggles, a circular reveal from the click origin is a great effect. The key is using `clip-path` with a growing circle:

```javascript
async function toggleTheme(event) {
  const { clientX: x, clientY: y } = event;
  const maxRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    document.documentElement.dataset.colorScheme =
      isDark ? 'light' : 'dark';
  });

  await transition.ready;

  document.documentElement.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
    { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
  );
}
```

The result feels instantly premium. Definitely worth adding to your toolkit.

## Astro Integration

Astro's ClientRouter uses the View Transitions API under the hood. You can hook into it via lifecycle events:

```javascript
document.addEventListener('astro:page-load', () => {
  // runs after each transition
});
```

Between native browser support and frameworks like Astro building on top of it, there's no excuse not to use this anymore.
