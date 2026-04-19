---
title: 'Markdown Garden'
description: 'A distraction-free markdown editor with live preview, syntax highlighting, and a digital garden publishing workflow.'
pubDate: 2024-11-03
updatedDate: 2025-02-14
category: 'Editor'
tags: ['Astro', 'Markdown', 'CodeMirror', 'Static Site']
status: 'released'
coverImage: ./pexels-ivan-s-7213096.jpg
coverAlt: Overhead view of a person typing on a laptop at a minimal dark desk
---

## Overview

Markdown Garden combines a clean writing experience with a built-in publishing pipeline. Write in markdown, preview instantly, and publish to a static digital garden with bidirectional links and a graph view.

## Key Features

- Split-pane editor with synchronized scrolling
- Syntax highlighting via CodeMirror 6
- Wikilink support with automatic backlink generation
- Interactive graph view of note connections
- One-click publish to static HTML

## Technical Highlights

The editor uses CodeMirror 6 with custom extensions for wikilink syntax highlighting and autocompletion. The graph view renders note connections using a force-directed layout on canvas, with zoom and pan controls.

Publishing generates an Astro static site with pre-rendered pages, automatic backlink injection, and full-text search powered by Pagefind.
