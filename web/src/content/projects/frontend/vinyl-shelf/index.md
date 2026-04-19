---
title: 'Vinyl Shelf'
description: 'A music collection catalog with album art grids, Discogs API integration, and playback statistics pulled from Last.fm.'
pubDate: 2025-05-08
category: 'Media'
tags: ['Vue', 'API Integration', 'CSS Grid', 'Responsive Design']
status: 'released'
coverImage: ./pexels-refargotohp-83494488-8927039.jpg
coverAlt: Tablet displaying a colorful home screen with app icons against a gradient background
---

## Overview

Vinyl Shelf lets music collectors browse and catalog their physical and digital music libraries. Albums are displayed in a visually rich grid with detailed metadata, listening history, and collection statistics.

## Key Features

- Album grid with cover art, filterable by genre, year, and format
- Discogs API integration for automatic metadata lookup
- Last.fm scrobble history and listening statistics
- Responsive masonry layout adapting to screen size
- Collection value estimation based on marketplace data

## Technical Highlights

Built with Vue 3 Composition API, the app uses virtual scrolling to handle collections of thousands of albums without performance degradation. Album art is lazy-loaded with blur-up placeholders generated at build time.

The Discogs integration handles rate limiting gracefully with a request queue and exponential backoff.
