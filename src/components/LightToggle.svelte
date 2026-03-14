<script lang="ts">
  import { onMount } from 'svelte';

  type LightMode = 'light' | 'dark';

  let currentMode: LightMode = $state('light');

  function setTheme(theme: 'light' | 'dark') {
    document.documentElement!.dataset.colorScheme = theme;
    localStorage.setItem('colorScheme', theme);
    currentMode = theme;
  }

  function toggleTheme() {
    if (document.documentElement!.dataset.colorScheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  onMount(() => {
    if (localStorage.getItem('colorScheme')) {
      currentMode = localStorage.getItem('colorScheme') as LightMode;
    } else {
      currentMode = window.matchMedia('(prefers-color-scheme: light')
        ? 'light'
        : 'dark';
    }
  });
</script>

<button
  class="color-scheme-toggle"
  onclick={toggleTheme}
  title={`Toggle ${currentMode === 'light' ? 'Dark' : 'Light'} Mode`}
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
    font-size: 1.2rem;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  [data-active='false'] {
    display: none;
  }

  @keyframes colorSchemeTransition {
    from {
      scale: (1, 1);
    }
    to {
      scale: (0, 1);
    }
  }
</style>
