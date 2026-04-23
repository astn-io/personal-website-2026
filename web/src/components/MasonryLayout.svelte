<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    gap?: string;
    minColumnWidth?: string;
    children?: Snippet;
  };

  const {
    gap = '1.25rem',
    minColumnWidth = '18rem',
    children,
  }: Props = $props();
</script>

<div
  class="masonry"
  style:--masonry-gap={gap}
  style:--masonry-min-col-width={minColumnWidth}
>
  {@render children?.()}
</div>

<style lang="scss">
  .masonry {
    columns: var(--masonry-min-col-width) auto;
    column-gap: var(--masonry-gap);

    :global(> *) {
      break-inside: avoid;
      display: block;
      width: 100%;
      margin: 0 0 var(--masonry-gap);
    }
  }
</style>
