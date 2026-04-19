---
title: 'Font Specimen'
description: 'A typography testing tool that lets designers preview custom fonts with adjustable OpenType features, variable axes, and paragraph settings.'
pubDate: 2025-08-14
category: 'Design Tool'
tags: ['Vanilla JS', 'OpenType', 'CSS', 'Variable Fonts']
status: 'developing'
coverImage: ./pexels-rd-270521240-31084604.jpg
coverAlt: Person examining artwork on a computer screen with hands clasped
---

## Overview

Font Specimen provides a comprehensive environment for evaluating typefaces. Designers can load local font files, adjust variable font axes in real time, toggle OpenType features, and compare fonts side by side.

## Key Features

- Drag-and-drop font file loading (OTF, TTF, WOFF2)
- Variable font axis sliders with real-time preview
- OpenType feature toggles (ligatures, stylistic sets, small caps)
- Side-by-side font comparison mode
- Paragraph settings: line height, letter spacing, word spacing

## Technical Highlights

Font files are parsed client-side using opentype.js to extract axis definitions, feature tables, and glyph data. Variable font axes are dynamically mapped to range sliders based on the font's fvar table.

The preview renderer uses CSS `font-variation-settings` and `font-feature-settings` for real-time adjustments without re-parsing the font file. A waterfall view displays the font at standard sizes from 8px to 120px.
