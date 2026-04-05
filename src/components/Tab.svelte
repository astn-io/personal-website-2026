<script lang="ts">
  import type { Snippet } from '@astrojs/svelte/svelte-shims.d.ts';

  type Props = {
    name: string;
    children: Snippet;
  };

  let { name, children }: Props = $props();
</script>

<section class="tab-section" data-tab-name={name}>
  {@render children?.()}
</section>

<style>
  section {
    padding: 1rem;
  }
</style>
