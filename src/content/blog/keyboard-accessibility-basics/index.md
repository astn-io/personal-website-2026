---
title: 'Keyboard Accessibility Basics'
description: 'The minimum every web developer should know about keyboard navigation, focus management, and ARIA — with concrete patterns you can apply today.'
pubDate: 2026-03-18
---

# Keyboard Accessibility Basics

A lot of accessibility advice is either vague ("be accessible!") or overwhelming. This is the concrete minimum that covers the most common gaps.

## Why Keyboard Accessibility

Keyboard navigation isn't just for screen reader users. It helps:

- People with motor impairments who can't use a mouse
- Power users who prefer the keyboard
- Anyone with a broken touchpad

If your site is fully keyboard navigable, it's generally also screen reader accessible.

## The Focus Ring

The most common mistake: removing the focus ring with `outline: none` and not replacing it.

```css
/* Bad */
:focus {
  outline: none;
}

/* Good — only hide it for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid oklch(55% 0.22 260);
  outline-offset: 3px;
}
```

`focus-visible` is broadly supported and is exactly what you want.

## Interactive Element Rules

Use the right semantic element:

- **`<button>`** for actions
- **`<a href>`** for navigation
- **`<input>`**, **`<select>`**, **`<textarea>`** for form controls

Custom interactive elements need extra work:

```html
<!-- Interactive div needs role, tabindex, and keyboard handler -->
<div
  role="button"
  tabindex="0"
  @click="handleClick"
  @keydown.enter="handleClick"
  @keydown.space.prevent="handleClick"
>
  Click me
</div>
```

Better: just use a `<button>` and style it.

## Skip Links

Add a skip link as the first focusable element on the page:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
}

.skip-link:focus {
  top: 1rem;
}
```

This lets keyboard users jump past the navigation on every page.

## Focus Trapping in Modals

When a modal opens, focus should be trapped inside it:

```javascript
function trapFocus(modal) {
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  });

  first.focus();
}
```

Return focus to the trigger element when the modal closes.

Small effort, big impact.
