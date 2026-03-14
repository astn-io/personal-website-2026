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
  <span class="icon icon-light ri-sun-fill"></span>
  <span class="icon icon-dark ri-moon-clear-fill"></span>
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

  .icon {
    position: absolute;

    font-size: 1.2rem;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .icon-dark {
    transform: scale(0, 0);
    opacity: 0;
  }

  :global([data-color-scheme='dark']) .icon-light {
    transform: scale(0, 0);
    opacity: 0;
  }

  :global([data-color-scheme='dark']) .icon-dark {
    transform: scale(1, 1);
    opacity: 1;
  }
</style>
