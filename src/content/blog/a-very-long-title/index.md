---
title: "This Will Be a Post With A Very Long Title! Yes, Ineed. A Title so Long that It Will Reach the Heavens Themselves. So Long that You Might Never Actually Get This Far into Reading It. I forget what words to capitalize, so I'm actually just going to give up even bothering at this point. Honestly I just wanted to see what would happen if I made this title ridiculously long."
description: 'This Will Be a Post With A Very Long Description, Too! Yes, Ineed. A Description so Long that It Will Reach the Heavens Themselves. So Long that You Might Never Actually Get This Far into Reading It. I forget what words to capitalize, so I''m actually just going to give up even bothering at this point. Honestly I just wanted to see what would happen if I made this title ridiculously long. Yes, I also basically just copied the title and replaced the word "Title" with the word "Description" so if you got a problem with that, then too bad.'
pubDate: 2024-09-04
coverImage: ./pexels-chuotanhls-14617568.jpg
coverAlt: A woman staring off into the distance
---

# Building a Personal Site with Astro

After years of putting it off, I finally rebuilt my personal website — and I'm pretty happy with how it turned out. Here's what I learned along the way.

## Why Astro?

I've built personal sites in plain HTML, React, and even SvelteKit. This time I wanted something that felt right for mostly-static content but didn't force me to give up interactivity where I needed it.

Astro's island architecture was exactly that. Static by default, interactive on demand.

> The best tool is the one that gets out of your way.

## The Component Split

I settled on a clear rule:

- **Astro components** for anything structural or purely static
- **Svelte components** for anything that needs reactivity

This turned out to be a great mental model. The AppBar needs scroll detection — Svelte. The footer is just links — Astro. No ambiguity.

## Styling Without a Framework

I went with custom SCSS and CSS custom properties instead of Tailwind or any utility framework. A few reasons:

1. Full control over the design language
2. No purging concerns or class-name sprawl
3. OKLCH color space works beautifully with CSS variables

The breakout grid technique from Kevin Powell made layout a pleasure.

## What I'd Do Differently

- Set up the content schema earlier — retrofitting it was annoying
- Write more posts before launch (you're reading proof I didn't)

Overall though: Astro was the right call. Highly recommend it for anyone building a content-focused personal site.
