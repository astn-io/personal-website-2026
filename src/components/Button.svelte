<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    label: string;
    link?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    onclick?: MouseEventHandler<HTMLButtonElement>;
    variant?: 'primary' | 'secondary' | 'tertiary';
    id?: string;
  };

  const {
    label,
    link,
    icon,
    iconPosition = 'left',
    onclick,
    variant = 'primary',
    id,
  }: Props = $props();
</script>

{#if link}
  <a {id} class={`btn btn-${variant}`} href={link}>
    {#if iconPosition === 'left'}
      <span class={`btn-icon ${icon}`}></span>
    {/if}
    <span>{label}</span>
    {#if iconPosition === 'right'}
      <span class={`btn-icon ${icon}`}></span>
    {/if}
  </a>
{:else}
  <button {id} class={`btn btn-${variant}`} {onclick}>
    {#if iconPosition === 'left'}
      <span class={`btn-icon ${icon}`}></span>
    {/if}
    <span>{label}</span>
    {#if iconPosition === 'right'}
      <span class={`btn-icon ${icon}`}></span>
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

    --btn-clr-outline: none;
    --btn-clr-outline-hover: none;
    --btn-clr-outline-active: none;

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-primary {
    --btn-clr-bg: oklch(from var(--clr-primary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-primary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-primary) calc(l - 0.1) c h);

    --btn-clr-outline: none;
    --btn-clr-outline-hover: none;
    --btn-clr-outline-active: none;

    --btn-clr-text: var(--clr-overlay-0);
    --btn-clr-text-hover: var(--clr-overlay-2);
  }

  /* --- Secondary --- */
  :global(:root[data-color-scheme='dark']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-base-2) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-base-2) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-base-2) calc(l - 0.1) c h);

    --btn-clr-outline: oklch(from var(--clr-surface-0) calc(l + 0.1) c h);
    --btn-clr-outline-hover: oklch(from var(--clr-surface-0) calc(l + 0.2) c h);
    --btn-clr-outline-active: oklch(
      from var(--clr-surface-0) calc(l - 0.2) c h
    );

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-overlay-0) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-overlay-0) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-overlay-0) calc(l - 0.1) c h);

    --btn-clr-outline: oklch(from var(--clr-overlay-2) l c h);
    --btn-clr-outline-hover: oklch(from var(--clr-overlay-2) calc(l + 0.2) c h);
    --btn-clr-outline-active: oklch(
      from var(--clr-overlay-2) calc(l - 0.2) c h
    );

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  /* --- Tertiary --- */
  :global(:root[data-color-scheme='dark']) .btn-tertiary {
    --btn-clr-bg: oklch(from var(--clr-tertiary) calc(l - 0.1) c h);
    --btn-clr-bg-hover: oklch(from var(--clr-tertiary) l c h);
    --btn-clr-bg-active: oklch(from var(--clr-tertiary) calc(l - 0.15) c h);

    --btn-clr-outline: none;
    --btn-clr-outline-hover: none;
    --btn-clr-outline-active: none;

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
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

  a.btn,
  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    width: fit-content;

    font-weight: 500;
    color: var(--btn-clr-text);
    text-decoration: none;

    border: none;
    outline: 2px solid var(--btn-clr-outline);
    border-radius: 2pt;

    padding-inline: 1.5rem;
    padding-block: 0.75rem;

    cursor: pointer;

    background-color: var(--btn-clr-bg);

    transition-property: background-color, outline;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a.btn:hover,
  button.btn:hover {
    background-color: var(--btn-clr-bg-hover);
    color: var(--btn-clr-text-hover);
    outline: 2px solid var(--btn-clr-outline-hover);
  }

  a.btn:active,
  button.btn:active {
    background-color: var(--btn-clr-bg-active);
    outline: 2px solid var(--btn-clr-outline-active);
  }

  span.btn-icon {
    font-size: 1.25rem;
    margin-left: 0.25rem;
  }
</style>
