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
  <span
    class="icon icon-light ri-sun-fill"
    data-active={currentMode === 'light' ? 'true' : 'false'}
  ></span>
  <span
    class="icon icon-dark ri-moon-clear-fill"
    data-active={currentMode === 'dark' ? 'true' : 'false'}
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

  .icon {
    position: absolute;

    font-size: 1.2rem;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  [data-active='true'] {
    transform: scale(1, 1);
    opacity: 1;
  }

  [data-active='false'] {
    transform: scale(0, 0);
    opacity: 0;
  }

  @keyframes colorSchemeTransition {
    from {
      scale: (1, 1);
    }
    to {
      scale: (0, 1);
      display: none;
    }
  }
</style>
