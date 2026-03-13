<script lang="ts">
  import { onMount } from 'svelte';

  let prefersLightMode: boolean = false;

  function onClick() {
    if (prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'dark';
    } else {
      document.documentElement!.dataset.colorScheme = 'light';
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

<button {onClick}> Toggle Light Mode </button>
