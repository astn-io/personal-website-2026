<script lang="ts">
  import type { MouseEventHandler } from 'svelte/elements';

  type Props = {
    label: string;
    link?: string;
    icon?: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
  };

  const { label, link, icon, onclick }: Props = $props();
</script>

{#if link}
  <a href={link}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </a>
{:else}
  <button {onclick}>
    <span class={`${icon}`}></span>
    <span>{label}</span>
  </button>
{/if}
