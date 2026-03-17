<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    label: string;
    link?: string;
    icon?: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    variant?: 'primary' | 'secondary' | 'tertiary';
    id?: string;
  };

  const {
    label,
    link,
    icon,
    onclick,
    variant = 'primary',
    id,
  }: Props = $props();
</script>

{#if link}
  <a {id} class={`btn btn-${variant}`} href={link}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </a>
{:else}
  <button {id} class={`btn btn-${variant}`} {onclick}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </button>
{/if}

<style>
  /* ------ Variables ------- */
  /* --- Primary --- */
  :global(:root[data-color-scheme='dark']) .btn-primary {
    --btn-clr-bg: oklch(from var(--clr-primary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-primary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-primary) calc(l - 0.1) c h);

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-primary {
    --btn-clr-bg: oklch(from var(--clr-primary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-primary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-primary) calc(l - 0.1) c h);

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  /* --- Secondary --- */
  :global(:root[data-color-scheme='dark']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-secondary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-secondary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-secondary) calc(l - 0.1) c h);

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-secondary {
    --btn-clr-bg: oklch(from var(--clr-secondary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-secondary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-secondary) calc(l - 0.1) c h);

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  /* --- Tertiary --- */
  :global(:root[data-color-scheme='dark']) .btn-tertiary {
    --btn-clr-bg: oklch(from var(--clr-tertiary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-tertiary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-tertiary) calc(l - 0.1) c h);

    --clr-text: var(--clr-text);
    --clr-text-hover: var(--clr-text-hover);
  }

  :global(:root[data-color-scheme='light']) .btn-tertiary {
    --btn-clr-bg: oklch(from var(--clr-tertiary) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-tertiary) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-tertiary) calc(l - 0.1) c h);

    --btn-clr-text: var(--clr-text);
    --btn-clr-text-hover: var(--clr-text-hover);
  }

  a.btn,
  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1rem;
    font-weight: 500;
    color: var(--btn-clr-text);
    text-decoration: none;

    border: none;

    padding-inline: 1rem;
    padding-block: 0.6rem;

    cursor: pointer;

    background-color: var(--btn-clr-bg);

    transition-property: background-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a.btn:hover,
  button.btn:hover {
    background-color: var(--btn-clr-bg-hover);
    color: var(--btn-clr-text-hover);
  }

  a.btn:active,
  button.btn:active {
    background-color: var(--btn-clr-bg-active);
  }
</style>
