---
title: 'Map Memories'
description: 'A travel journal app that pins photos and notes to an interactive map, with route visualization and trip timeline playback.'
pubDate: 2025-09-01
category: 'Travel'
tags: ['Mapbox', 'EXIF', 'Svelte', 'Geolocation']
status: 'developing'
coverImage: ./pexels-oktay-koseoglu-42034955-30215686.jpg
coverAlt: Person working on a laptop in a dimly lit room with a warm desk lamp
---

## Overview

Map Memories turns travel photos into an interactive map-based journal. Photos are automatically geotagged using EXIF data, and trips can be replayed as animated routes on the map.

## Key Features

- Automatic photo geotagging from EXIF metadata
- Interactive map with clustered photo markers
- Trip route visualization with animated playback
- Rich text notes attached to locations
- Offline map tile caching for travel use

## Technical Highlights

EXIF data is extracted client-side using a lightweight parser that reads GPS coordinates, timestamps, and camera settings directly from image files. Photos without GPS data can be manually placed on the map.

Route playback animates a marker along the trip path using Mapbox's camera API, with smooth easing between stops. Photo clusters dynamically expand and collapse based on zoom level using a custom spatial index.
