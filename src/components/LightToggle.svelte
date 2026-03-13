<script lang="ts">
  import { onMount } from 'svelte';

  let prefersLightMode: boolean = false;

  function toggleTheme() {
    if (prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'dark';
      prefersLightMode = false;
    } else if (!prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'light';
      prefersLightMode = true;
    }
  }

  onMount(() => {
    const prefersLightMode = window.matchMedia(
      '(prefers-color-scheme: light)',
    ).matches;

    if (prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'light';
    }

    if (!prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'dark';
    }
  });
</script>

<button onclick={toggleTheme}> Toggle Light Mode </button>
