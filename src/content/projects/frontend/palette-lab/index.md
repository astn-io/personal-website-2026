---
title: "Palette Lab"
description: "A color palette generator and accessibility checker that helps designers create harmonious, WCAG-compliant color schemes using OKLCH color space."
pubDate: 2025-01-10
updatedDate: 2025-04-18
category: "Design Tool"
tags: ["Vanilla JS", "OKLCH", "Accessibility", "Color Theory"]
status: "complete"
coverImage: ./pexels-diva-plavalaguna-6937847.jpg
coverAlt: Designer with pink hair working at a computer in a cozy brick-walled studio
---

## Overview

Palette Lab generates color palettes using perceptually uniform color spaces, with built-in contrast ratio checking against WCAG 2.1 and 3.0 guidelines. Designers can export palettes as CSS custom properties, Tailwind configs, or Figma tokens.

## Key Features

- OKLCH-based palette generation for perceptual uniformity
- Real-time WCAG contrast ratio checking
- Multiple harmony rules: complementary, analogous, triadic, split-complementary
- Export to CSS custom properties, JSON, or Tailwind config
- Shareable palette URLs via encoded query parameters

## Technical Highlights

All color math is performed in the OKLCH color space for perceptual accuracy. The app converts between sRGB, P3, and OKLCH gamuts with fallback handling for out-of-gamut colors. No external color libraries are used — all conversions follow the CSS Color Level 4 specification.
