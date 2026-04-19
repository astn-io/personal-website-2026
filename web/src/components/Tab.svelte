<script lang="ts">
  import type { Snippet } from '@astrojs/svelte/svelte-shims.d.ts';

  type Props = {
    name: string;
    icon?: string;
    children: Snippet;
  };

  let { name, icon, children }: Props = $props();
</script>

<section class="tab-section" data-tab-name={name} data-tab-icon={icon}>
  {@render children?.()}
</section>

<style>
  section {
    padding: 1rem;
  }

  @container (width < 820px) {
    section.tab-section {
      padding-block: 0;
      padding-inline: 1px;
      background-color: transparent;
    }
  }
</style>
