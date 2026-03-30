---
title: "Weather Dashboard"
description: "A real-time weather dashboard featuring animated forecasts, interactive radar maps, and location-based alerts built with Svelte and the OpenWeatherMap API."
pubDate: 2025-06-15
updatedDate: 2025-08-02
category: "Web App"
tags: ["Svelte", "API Integration", "Data Visualization", "CSS Animations"]
status: "complete"
coverImage: ./pexels-junior-teixeira-1064069-2047905.jpg
coverAlt: Laptop half-closed glowing with colorful light in a dark room
---

## Overview

Weather Dashboard is a responsive web application that displays current conditions, hourly forecasts, and 7-day outlooks for any location worldwide. Users can save favorite locations and receive severe weather alerts.

## Key Features

- Real-time weather data from OpenWeatherMap API
- Interactive radar map with precipitation overlays
- Animated weather icons using CSS and SVG transitions
- Geolocation-based automatic weather detection
- Dark and light theme support

## Technical Highlights

Built entirely with Svelte 5 and vanilla CSS, this project avoids heavy charting libraries by rendering forecast graphs directly on a `<canvas>` element. API responses are cached in localStorage with a 15-minute TTL to reduce unnecessary network requests.

The radar map uses Leaflet.js with custom tile layers for precipitation and temperature overlays. Animations are handled through CSS keyframes and Svelte transitions for smooth state changes.
