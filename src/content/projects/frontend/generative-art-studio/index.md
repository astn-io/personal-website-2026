---
title: 'Generative Art Studio'
description: 'A node-based visual programming environment for creating generative art, with real-time canvas rendering and SVG export.'
pubDate: 2025-10-12
category: 'Creative Coding'
tags: ['Canvas API', 'SVG', 'TypeScript', 'Node Graph']
status: 'closed'
coverImage: ./pexels-pachon-in-motion-426015731-30547594.jpg
coverAlt: Abstract digital art with red and orange geometric patterns and light streaks
---

## Overview

Generative Art Studio lets artists and creative coders build visual algorithms by connecting nodes in a graph editor. Each node performs a specific operation — noise generation, shape drawing, color mapping — and the output renders live on canvas.

## Key Features

- Node-based visual programming interface
- Real-time canvas preview with adjustable resolution
- Built-in noise generators: Perlin, Simplex, Worley
- Shape primitives with transformation stacking
- Export to SVG, PNG, or animated GIF

## Technical Highlights

The node graph evaluator performs a topological sort of connected nodes and executes them in dependency order. Each node is a pure function that takes typed inputs and produces typed outputs, enabling safe composition.

The rendering pipeline supports both Canvas 2D and SVG output modes. Canvas mode uses offscreen rendering with double buffering for smooth animation, while SVG mode builds a document tree that can be exported as a scalable vector file.

This project was cancelled due to scope creep — the node system grew too complex for a solo side project, and existing tools like NodeBox and Cables.gl already serve this space well.
