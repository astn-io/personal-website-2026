<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    label: string;
    link?: string;
    icon?: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    variant?: 'primary' | 'secondary' | 'tertiary';
  };

  const { label, link, icon, onclick, variant = 'primary' }: Props = $props();
</script>

{#if link}
  <a class={`btn btn-${variant}`} href={link}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </a>
{:else}
  <button class={`btn btn-${variant}`} {onclick}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </button>
{/if}

<style>
  /* ------ Variables ------- */
  /* --- Primary --- */
  :global(:root[data-color-scheme='dark']) .btn-primary {
    --clr-bg: oklch(from var(--clr-primary) l c h);
    --clr-bg-hover: oklch(from var(--clr-primary) calc(l + 0.1) c h);
  }

  :global(:root[data-color-scheme='light']) .btn-primary {
    --clr-bg: oklch(from var(--clr-primary) l c h);
    --clr-bg-hover: oklch(from var(--clr-primary) l c h);
  }

  /* --- Secondary --- */
  :global(:root[data-color-scheme='dark']) .btn-secondary {
    --clr-bg: oklch(from var(--clr-secondary) l c h);
    --clr-bg-hover: oklch(from var(--clr-secondary) calc(l + 0.1) c h);
  }

  :global(:root[data-color-scheme='light']) .btn-secondary {
    --clr-bg: oklch(from var(--clr-secondary) l c h);
    --clr-bg-hover: oklch(from var(--clr-secondary) l c h);
  }

  /* --- Tertiary --- */
  :global(:root[data-color-scheme='dark']) .btn-tertiary {
    --clr-bg: oklch(from var(--clr-tertiary) l c h);
    --clr-bg-hover: oklch(from var(--clr-tertiary) calc(l + 0.1) c h);
  }

  :global(:root[data-color-scheme='light']) .btn-tertiary {
    --clr-bg: oklch(from var(--clr-tertiary) l c h);
    --clr-bg-hover: oklch(from var(--clr-tertiary) l c h);
  }

  a.btn,
  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;

    padding-inline: 1rem;
    padding-block: 0.6rem;

    cursor: pointer;

    background-color: var(--clr-bg);

    transition-property: background-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a.btn:hover,
  button.btn:hover {
    background-color: var(--clr-bg-hover);
  }
</style>
