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
  a.btn,
  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    border: none;

    padding-inline: 1rem;
    padding-block: 0.6rem;

    cursor: pointer;
  }

  .btn-primary {
    background-color: var(--clr-primary);
  }

  .btn-secondary {
    background-color: var(--clr-secondary);
  }

  .btn-tertiary {
    background-color: var(--clr-tertiary);
  }
</style>
