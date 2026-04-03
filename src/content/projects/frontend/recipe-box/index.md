---
title: 'Recipe Box'
description: 'A recipe management app with ingredient scaling, meal planning calendars, and automatic grocery list generation.'
pubDate: 2025-02-28
category: 'Lifestyle'
tags: ['SolidJS', 'TypeScript', 'Local Storage', 'Print Styles']
status: 'released'
coverImage: ./pexels-peaky-29445974.jpg
coverAlt: Close-up of colorful source code displayed on a dark monitor
---

## Overview

Recipe Box helps home cooks organize their favorite recipes, plan weekly meals, and generate consolidated shopping lists. All data stays local in the browser with optional JSON import/export.

## Key Features

- Recipe entry with structured ingredients and step-by-step instructions
- Dynamic ingredient scaling for any serving size
- Drag-and-drop weekly meal planner
- Automatic grocery list generation with aisle grouping
- Print-optimized recipe cards

## Technical Highlights

Built with SolidJS for fine-grained reactivity, ingredient scaling recalculates amounts in real-time without re-rendering the entire recipe. Fraction parsing handles inputs like "1 1/2 cups" and converts between metric and imperial units.

The grocery list aggregator merges duplicate ingredients across recipes, combining "2 cups flour" from one recipe with "1 cup flour" from another into a single "3 cups flour" entry.
