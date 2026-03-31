---
title: 'Svelte 5 Runes: First Impressions'
description: "A look at Svelte 5's new runes API after using it in a real project — what works, what surprised me, and what I miss from Svelte 4."
pubDate: 2025-10-11
coverImage: ./pexels-benjamin-thamm-2160256650-36598929.jpg
coverAlt: Close-up of a purple hepatica wildflower with soft bokeh background
category: Frameworks
tags:
  - svelte
  - svelte-5
  - runes
  - reactivity
  - state-management
  - props
  - frontend-frameworks
---

# Svelte 5 Runes: First Impressions

Svelte 5 shipped with a significant change to its reactivity model: runes. Instead of magic top-level variable declarations, you now use explicit function calls like `$state()`, `$derived()`, and `$props()`.

I've now shipped a project with it, so here are my honest thoughts.

## What Changed

In Svelte 4, any `let` in a component was implicitly reactive:

```svelte
<script>
  let count = 0; // reactive!
</script>
```

In Svelte 5, you opt in explicitly:

```svelte
<script>
  let count = $state(0); // reactive
  let double = $derived(count * 2);
</script>
```

## What I Like

**Clarity.** There's no magic anymore. When I read a Svelte 5 component, I immediately know what's reactive and what isn't. This matters more than I expected.

**`$props()` is great.** Declaring props feels cleaner and more aligned with how you'd think about it:

```svelte
<script>
  let { label, onClick } = $props();
</script>
```

**Runes work in `.ts` files too.** You can extract reactive state into plain TypeScript modules now, which opens up some nice patterns.

## What I Miss

Honestly, not much. The old magic was charming but also the source of real confusion for newcomers. The tradeoff feels worth it.

The one thing that tripped me up: `$effect()` runs after every render where its dependencies change — which sounds obvious, but I still wrote a few accidental infinite loops before internalizing it.

## Verdict

If you're starting a new Svelte project, use runes from day one. Don't look back.
