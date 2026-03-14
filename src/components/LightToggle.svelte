<script lang="ts">
  import { onMount } from 'svelte';

  let currentMode = $state('Light');

  function toggleTheme() {
    if (localStorage.getItem('colorScheme') === 'light') {
      document.documentElement!.dataset.colorScheme = 'dark';
      localStorage.setItem('colorScheme', 'dark');
      currentMode = 'Dark';
    } else if (localStorage.getItem('colorScheme') === 'dark') {
      document.documentElement!.dataset.colorScheme = 'light';
      localStorage.setItem('colorScheme', 'light');
      currentMode = 'Light';
    }
  }

  onMount(() => {
    let prefersLightMode: boolean = false;

    currentMode =
      localStorage.getItem('colorScheme') === 'dark' ? 'Dark' : 'Light';

    if (localStorage.getItem('colorScheme')) {
      prefersLightMode =
        localStorage.getItem('colorScheme') === 'light' ? true : false;
    } else {
      prefersLightMode = window.matchMedia(
        '(prefers-color-scheme: light)',
      ).matches;
    }

    if (prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'light';
    } else if (!prefersLightMode) {
      document.documentElement!.dataset.colorScheme = 'dark';
    }
  });
</script>

<button onclick={toggleTheme}> Toggle {currentMode} Mode </button>
