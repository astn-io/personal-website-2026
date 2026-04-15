<script lang="ts">
  import type { Snippet } from '@astrojs/svelte/svelte-shims.d.ts';
  import type { MouseEventHandler } from 'svelte/elements';
  import { btnVariant, btnStyle, btnIconPos } from '@scripts/types';

  type Props = {
    link?: string;
    icon?: string;
    iconAnimate?: boolean;
    iconPosition?: btnIconPos;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    variant?: btnVariant;
    id?: string;
    style?: btnStyle;
    children: Snippet;
    size?: 'small' | 'medium';
  };

  const {
    link,
    icon,
    iconAnimate = true,
    iconPosition = btnIconPos.left,
    onclick,
    variant = btnVariant.primary,
    id,
    style = btnStyle.button,
    children,
    size = 'medium',
  }: Props = $props();
</script>

{#if link}
  <a
    {id}
    class={`btn btn-${size} btn-${variant}`}
    href={link}
    data-style={style}
  >
    {#if iconPosition === btnIconPos.left}
      <span class={`btn-icon icon-left ${icon}`} data-icon-animate={iconAnimate}
      ></span>
    {/if}
    <span>
      {@render children?.()}
    </span>
    {#if iconPosition === btnIconPos.right}
      <span
        class={`btn-icon icon-right ${icon}`}
        data-icon-animate={iconAnimate}
      ></span>
    {/if}
  </a>
{:else}
  <button
    {id}
    class={`btn btn-${size} btn-${variant}`}
    {onclick}
    data-style={style}
  >
    {#if iconPosition === btnIconPos.left}
      <span class={`btn-icon icon-left ${icon}`} data-icon-animate={iconAnimate}
      ></span>
    {/if}
    <span>
      {@render children?.()}
    </span>
    {#if iconPosition === btnIconPos.right}
      <span
        class={`btn-icon icon-right ${icon}`}
        data-icon-animate={iconAnimate}
      ></span>
    {/if}
  </button>
{/if}

<style>
  /* ------ Variables ------- */
  /* --- Primary --- */
  :global(:root[data-color-scheme='dark']) .btn-primary {
    --btn-clr-bg: oklch(from var(--clr-primary) calc(l - 0.1) c h);
    --btn-clr-bg-hover: oklch(from var(--clr-primary) l c h);
    --btn-clr-bg-active: oklch(from var(--clr-primary) calc(l - 0.15) c h);

    --btn-clr-outline: transparent;
    --btn-clr-outline-hover: transparent;
    --btn-clr-outline-active: transparent;

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-primary {
    --btn-clr-bg: oklch(from var(--clr-primary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-primary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-primary) calc(l - 0.1) c h);

    --btn-clr-outline: transparent;
    --btn-clr-outline-hover: transparent;
    --btn-clr-outline-active: transparent;

    --btn-clr-text: var(--clr-base-1);
    --btn-clr-text-hover: var(--clr-base-0);
  }

  /* --- Secondary --- */
  :global(:root[data-color-scheme='dark']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-surface-0) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-surface-1) l c h);
    --btn-clr-bg-active: oklch(from var(--clr-surface-1) l c h);

    --btn-clr-outline: oklch(from var(--clr-surface-1) l c h);
    --btn-clr-outline-hover: oklch(from var(--clr-surface-2) l c h);
    --btn-clr-outline-active: oklch(
      from var(--clr-surface-1) calc(l - 0.2) c h
    );

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-surface-0) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-surface-1) l c h);
    --btn-clr-bg-active: oklch(from var(--clr-surface-1) l c h);

    --btn-clr-outline: oklch(from var(--clr-surface-1) l c h);
    --btn-clr-outline-hover: oklch(from var(--clr-surface-2) l c h);
    --btn-clr-outline-active: oklch(from var(--clr-surface-2) l c h);

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  /* --- Tertiary --- */
  :global(:root[data-color-scheme='dark']) .btn-tertiary {
    --btn-clr-bg: oklch(from var(--clr-tertiary) calc(l - 0.1) c h);
    --btn-clr-bg-hover: oklch(from var(--clr-tertiary) l c h);
    --btn-clr-bg-active: oklch(from var(--clr-tertiary) calc(l - 0.15) c h);

    --btn-clr-outline: none;
    --btn-clr-outline-hover: none;
    --btn-clr-outline-active: none;

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-tertiary {
    --btn-clr-bg: oklch(from var(--clr-tertiary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-tertiary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-tertiary) calc(l - 0.1) c h);

    --btn-clr-outline: none;
    --btn-clr-outline-hover: none;
    --btn-clr-outline-active: none;

    --btn-clr-text: var(--clr-overlay-0);
    --btn-clr-text-hover: var(--clr-overlay-2);
  }

  .btn-primary {
    --btn-font-weight: 700;
  }

  .btn-secondary,
  .btn-tertiary {
    --btn-font-weight: 500;
  }

  a.btn,
  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    width: fit-content;

    font-weight: var(--btn-font-weight);
    color: var(--btn-clr-text);
    text-decoration: none;
    letter-spacing: 0.015ch;

    border: none;

    outline-width: 2px;
    outline-style: solid;
    outline-color: inherit;

    cursor: pointer;

    transition-property: background-color, outline, color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a.btn:focus,
  button.btn:focus,
  a.btn.btn-primary:focus,
  button.btn.btn-primary:focus,
  a.btn.btn-secondary:focus,
  button.btn.btn-secondary:focus,
  a.btn.btn-tertiary:focus,
  button.btn.btn-tertiary:focus {
    outline-color: var(--clr-text-0);
  }

  a.btn.btn-medium[data-style='button'],
  button.btn.btn-medium[data-style='button'] {
    padding-inline: 1rem;
    padding-block: 0.75rem;
  }

  a.btn.btn-small[data-style='button'],
  button.btn.btn-small[data-style='button'] {
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
  }

  a.btn[data-style='button'],
  button.btn[data-style='button'] {
    outline: 2px solid var(--btn-clr-outline);
    border-radius: 2pt;

    background-color: var(--btn-clr-bg);
  }

  a.btn[data-style='button']:hover,
  button.btn[data-style='button']:hover {
    background-color: var(--btn-clr-bg-hover);
    color: var(--btn-clr-text-hover);
    outline: 2px solid var(--btn-clr-outline-hover);
  }

  a.btn[data-style='button']:active,
  button.btn[data-style='button']:active {
    background-color: var(--btn-clr-bg-active);
    outline: 2px solid var(--btn-clr-outline-active);
  }

  a.btn[data-style='simple'],
  button.btn[data-style='simple'] {
    padding: 0;

    background-color: transparent;
    color: var(--clr-primary);

    font-weight: 400;
  }

  a.btn[data-style='simple']:hover,
  button.btn[data-style='simple']:hover {
    color: oklch(from var(--clr-primary) calc(l + 0.1) c h);
  }

  span.btn-icon {
    position: relative;

    font-size: 1.25rem;

    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .icon-right {
    margin-left: 0.25rem;
  }

  .icon-left {
    margin-right: 0.25rem;
  }

  a.btn:hover > .btn-icon[data-icon-animate='true'],
  button.btn:hover > .btn-icon[data-icon-animate='true'] {
    transform: rotateZ(-30deg);
  }
</style>
