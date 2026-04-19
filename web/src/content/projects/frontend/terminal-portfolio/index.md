---
title: 'Terminal Portfolio'
description: 'An interactive portfolio site styled as a command-line interface, complete with a custom shell parser and ASCII art rendering.'
pubDate: 2024-09-12
updatedDate: 2024-12-01
category: 'Portfolio'
tags: ['Vanilla JS', 'CSS', 'ASCII Art', 'Accessibility']
status: 'released'
coverImage: ./pexels-cottonbro-7504600.jpg
coverAlt: Person peering over the top of a computer monitor with focused eyes
---

## Overview

Terminal Portfolio presents personal and professional information through a simulated terminal interface. Visitors type commands to navigate sections, view projects, and even play a hidden text adventure game.

## Key Features

- Custom command parser with tab completion and history
- ASCII art rendering for project screenshots
- Animated typing effects for command output
- Hidden easter eggs and a text adventure mini-game
- Full keyboard accessibility with screen reader support

## Technical Highlights

The shell parser tokenizes input and matches commands against a registry with support for flags and arguments. Tab completion uses a trie data structure for efficient prefix matching.

Despite the terminal aesthetic, the site maintains full accessibility with proper ARIA roles, focus management, and a screen reader mode that presents content in standard document flow.
