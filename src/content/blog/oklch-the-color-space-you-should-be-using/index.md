---
title: 'OKLCH: The Color Space You Should Be Using'
description: 'Why OKLCH produces better design results than HSL, how to use it in CSS, and a few gotchas to watch out for.'
pubDate: 2025-11-22
---

# OKLCH: The Color Space You Should Be Using

If you're still defining your design system in HSL or hex, you're making your life harder than it needs to be.

OKLCH is a perceptually uniform color space that maps much more closely to how humans actually perceive color. The result: predictable, consistent, beautiful theming with less trial and error.

## The Problem with HSL

HSL sounds great in theory — hue, saturation, lightness. But "lightness" in HSL isn't perceptual lightness. Two colors at `50%` lightness can look wildly different in brightness:

- `hsl(60, 100%, 50%)` — bright yellow
- `hsl(240, 100%, 50%)` — noticeably darker blue

This makes generating harmonious palettes by algorithm basically impossible in HSL.

## Enter OKLCH

OKLCH gives you:

- **L** — perceptual lightness (0 to 1)
- **C** — chroma (colorfulness)
- **H** — hue angle (0–360°)

Adjust L and the brightness changes consistently, regardless of hue. This is huge for dark/light mode theming.

```css
:root {
  --color-primary: oklch(55% 0.22 260);
}

[data-color-scheme='light'] {
  --color-surface: oklch(97% 0.01 260);
  --color-on-surface: oklch(20% 0.04 260);
}

[data-color-scheme='dark'] {
  --color-surface: oklch(18% 0.04 260);
  --color-on-surface: oklch(92% 0.01 260);
}
```

Notice how I just flipped L values for dark mode. That's it.

## Browser Support

OKLCH is supported in all modern browsers. If you need to support older environments, use `@supports` with a hex fallback.

## Tools

- [oklch.com](https://oklch.com) — interactive picker, essential
- Figma now supports OKLCH natively
- The `color-mix()` CSS function pairs beautifully with OKLCH

Once you switch, going back to hex feels like writing assembly.
