---
title: 'RepCount'
description: 'A minimal fitness tracking PWA with offline support, workout templates, and progress charts rendered with D3.js.'
pubDate: 2025-07-20
category: 'Health & Fitness'
tags: ['PWA', 'D3.js', 'IndexedDB', 'Service Workers']
status: 'developing'
coverImage: ./pexels-pixabay-257923.jpg
coverAlt: Smartphone resting next to a laptop on a clean white surface
---

## Overview

RepCount is a progressive web app designed for gym-goers who want a fast, no-frills way to log workouts. It works fully offline and syncs data when connectivity returns.

## Key Features

- Offline-first architecture with Service Workers
- Customizable workout templates with rest timers
- Progress tracking with D3.js-rendered charts
- Personal records detection and celebration animations
- Data export to CSV and JSON formats

## Technical Highlights

All workout data is stored in IndexedDB, making the app fully functional without network access. The Service Worker caches all static assets and handles background sync for optional cloud backup.

Charts are built with D3.js using responsive SVG containers that adapt to viewport changes. Workout timer notifications use the Notification API with fallback to in-app alerts.
