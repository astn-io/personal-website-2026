<script lang="ts">
  import { onMount } from 'svelte';

  let currentMode: String | null = $state('Light');

  function toggleTheme() {
    if (document.documentElement!.dataset.colorScheme === 'light') {
      document.documentElement!.dataset.colorScheme = 'dark';
      localStorage.setItem('colorScheme', 'dark');
      currentMode = 'Dark';
    } else {
      document.documentElement!.dataset.colorScheme = 'light';
      localStorage.setItem('colorScheme', 'light');
      currentMode = 'Light';
    }
  }

  onMount(() => {
    if (localStorage.getItem('colorScheme')) {
      currentMode =
        localStorage.getItem('colorScheme') === 'light' ? 'Light' : 'Dark';
    } else {
      currentMode = window.matchMedia('(prefers-color-scheme: light')
        ? 'Light'
        : 'Dark';
    }
  });
</script>

<button
  class="color-scheme-toggle"
  onclick={toggleTheme}
  title={`Toggle ${currentMode} Mode`}
>
  <span class="color-scheme-toggle--icon ri-sun-fill" data-active="true"></span>
  <span class="color-scheme-toggle--icon ri-moon-clear-fill" data-active="false"
  ></span>
</button>

<style>
  button.color-scheme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    margin-left: 1rem;

    width: 2rem;
    height: 2rem;

    border-radius: 50%;
    border: none;
  }

  .color-scheme-toggle--icon {
    font-size: 2rem;
  }

  [data-active='false'] {
    display: none;
  }
</style>
