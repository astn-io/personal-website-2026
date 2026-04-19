---
title: 'BudgetWise'
description: 'A personal finance dashboard with transaction categorization, budget tracking, and spending trend visualizations.'
pubDate: 2024-12-20
updatedDate: 2025-03-10
category: 'Finance'
tags: ['React', 'Chart.js', 'CSV Import', 'Responsive Design']
status: 'released'
coverImage: ./pexels-kampus-8636602.jpg
coverAlt: Professional working at a desktop computer in an office setting
---

## Overview

BudgetWise provides a clear overview of personal finances with automatic transaction categorization, monthly budget tracking, and visual spending breakdowns. It works entirely client-side with CSV imports from major banks.

## Key Features

- CSV transaction import with bank-specific format detection
- Automatic categorization with user-trainable rules
- Monthly and yearly budget setting and tracking
- Spending trend charts and category breakdowns
- Data stored locally with encrypted export option

## Technical Highlights

Transaction categorization uses a rule engine where users can define patterns that match merchant names to categories. Rules are applied in priority order, and unmatched transactions are flagged for manual review.

Chart.js renders responsive spending visualizations with custom tooltips and drill-down capability from yearly to monthly to daily views. All financial calculations use integer arithmetic in cents to avoid floating-point precision issues.
