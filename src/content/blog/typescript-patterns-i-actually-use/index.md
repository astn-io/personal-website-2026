---
title: 'TypeScript Patterns I Actually Use'
description: 'Not exhaustive, not academic — just the TypeScript patterns that come up in my work repeatedly and earn their keep.'
pubDate: 2026-01-28
coverImage: ./pexels-nikiemmert-28180162.jpg
coverAlt: A field of lavender flowers in full bloom
category: TypeScript
tags:
  - typescript
  - discriminated-unions
  - satisfies
  - template-literal-types
  - conditional-types
  - const-assertions
  - type-safety
  - design-patterns
---

# TypeScript Patterns I Actually Use

I've read a lot of TypeScript deep dives. Most of them are either too basic or too abstract. Here are the patterns I reach for in real projects, with the reasoning behind each.

## Discriminated Unions for State Machines

When you have a thing that can be in several mutually exclusive states, a discriminated union beats a pile of optional fields:

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

Now you can narrow with a `switch` on `status` and TypeScript knows exactly what fields are available in each branch. No more `data might be undefined` hedging everywhere.

## `satisfies` for Config Objects

When you want inference to flow through a config object without widening the type:

```typescript
const routes = {
  home: '/',
  blog: '/blog',
  about: '/about',
} satisfies Record<string, string>;

// routes.home is typed as '/' not string
```

## Template Literal Types for String APIs

Great for typed route params, CSS class names, event names, etc.:

```typescript
type ColorScale = 'primary' | 'secondary' | 'neutral';
type ColorShade = '100' | '200' | '300' | '400' | '500';
type ColorToken = `${ColorScale}-${ColorShade}`;
// 'primary-100' | 'primary-200' | ... | 'neutral-500'
```

## `infer` in Conditional Types

Scary looking but very useful for extracting types from generics:

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result = UnwrapPromise<Promise<{ id: number }>>;
// Result = { id: number }
```

## Const Assertions

For arrays and objects where you want exact literal types:

```typescript
const SIZES = ['sm', 'md', 'lg'] as const;
type Size = (typeof SIZES)[number]; // 'sm' | 'md' | 'lg'
```

Much better than manually keeping a type and array in sync.

---

None of these are novel. But if they're not in your regular rotation, start adding them — the payoff in IDE feedback and caught errors is real.
