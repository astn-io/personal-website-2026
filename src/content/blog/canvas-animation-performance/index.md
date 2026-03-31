---
title: 'Canvas Animation Performance: What Actually Matters'
description: 'How to keep canvas animations smooth at 60fps, from requestAnimationFrame basics to OffscreenCanvas and when to stop drawing entirely.'
pubDate: 2026-02-19
coverImage: ./pexels-hson-4061248.jpg
coverAlt: A woman in a bucket hat sitting on a rooftop terrace with a city skyline behind her, holding a slice of watermelon
category: Performance
tags:
  - canvas
  - animation
  - requestanimationframe
  - offscreencanvas
  - web-workers
  - intersection-observer
  - javascript
  - 60fps
---

# Canvas Animation Performance: What Actually Matters

I added a particle animation to this site's hero section. Getting it to feel smooth without wrecking battery life taught me a few things.

## The `requestAnimationFrame` Loop

The foundation of any canvas animation:

```javascript
let animationId;

function loop(timestamp) {
  update(timestamp);
  draw();
  animationId = requestAnimationFrame(loop);
}

function start() {
  animationId = requestAnimationFrame(loop);
}

function stop() {
  cancelAnimationFrame(animationId);
}
```

`requestAnimationFrame` is synced to the display refresh rate and pauses when the tab is hidden. Always use it instead of `setInterval`.

## Pause When Offscreen

Running a particle animation when the user has scrolled past it is pure waste. Use IntersectionObserver to pause it:

```javascript
const observer = new IntersectionObserver(
  ([entry]) => {
    entry.isIntersecting ? start() : stop();
  },
  { threshold: 0 }
);

observer.observe(canvas);
```

This alone makes a huge difference in battery and CPU usage.

## Avoid Per-Frame DOM Reads

Reading `canvas.width` or `canvas.getBoundingClientRect()` inside the loop forces layout recalculation. Cache these values and update them on `resize`:

```javascript
let width, height;

function resize() {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resize);
resize();
```

## Clear Efficiently

For most animations, clearing the whole canvas each frame is fine:

```javascript
ctx.clearRect(0, 0, width, height);
```

If you need a trail effect, draw a semi-transparent rectangle instead:

```javascript
ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
ctx.fillRect(0, 0, width, height);
```

## `OffscreenCanvas` for Heavy Work

If your drawing logic is expensive, move it to a Web Worker with `OffscreenCanvas`. The main thread stays unblocked:

```javascript
// main.js
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('animation.worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);
```

For a particle system with a few hundred particles, this probably isn't necessary. For something more compute-heavy, it's the right move.

## Summary

1. Use `requestAnimationFrame`
2. Pause when offscreen
3. Cache DOM measurements
4. Only reach for `OffscreenCanvas` if you actually need it

Simple rules, real impact.
