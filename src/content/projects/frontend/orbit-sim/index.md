---
title: "Orbit Simulator"
description: "A 2D orbital mechanics simulator rendered on HTML canvas, featuring gravitational physics, trajectory prediction, and time controls."
pubDate: 2025-04-05
category: "Simulation"
tags: ["Canvas API", "Physics", "TypeScript", "Web Workers"]
status: "incomplete"
coverImage: ./pexels-hoodzie-16062771.jpg
coverAlt: Computer hardware illuminated by blue and purple RGB lighting
---

## Overview

Orbit Simulator lets users place celestial bodies in a 2D space and observe gravitational interactions in real time. It serves as both an educational tool and a sandbox for experimenting with orbital mechanics.

## Key Features

- N-body gravitational simulation with configurable mass and velocity
- Trajectory prediction lines showing future orbital paths
- Time controls for slow motion, pause, and fast forward
- Preset scenarios: Earth-Moon, solar system, binary stars
- Zoom and pan with mouse or touch gestures

## Technical Highlights

Physics calculations run in a Web Worker to keep the UI thread responsive during complex N-body simulations. The Verlet integration method provides stable orbits even at larger time steps.

Trajectory prediction uses a separate simulation instance running ahead of real time, drawing projected paths as dotted lines. The renderer batches draw calls and uses offscreen canvases for static background elements.
