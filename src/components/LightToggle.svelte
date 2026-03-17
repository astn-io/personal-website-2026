<script lang="ts">
  import { onMount } from 'svelte';

  type LightMode = 'light' | 'dark';

  let currentMode: LightMode = $state('light');

  function setTheme(theme: 'light' | 'dark') {
    document.documentElement!.dataset.colorScheme = theme;
    localStorage.setItem('colorScheme', theme);
    currentMode = theme;
  }

  function updateTheme() {
    if (document.documentElement!.dataset.colorScheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  function setCircleTransitionOrigin(e: MouseEvent) {
    /**
     * This is specificly for the circle-in-top-right transition that plays.
     * This is to set the origin of the circle to the location of the light toggle button.
     */
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    document.documentElement.style.setProperty('--circle-x', `${x}px`);
    document.documentElement.style.setProperty('--circle-y', `${y}px`);
  }

  function transitionTheme(e: MouseEvent) {
    /**
     * The AppBar is setup so that it doesn't transition during page transitions.
     * However, this caused it to stop working with the theme transitions, too.
     * This is a fix for that so it doesn't transition during navigation, but
     * still transitions during theme changes.
     */
    const appbar = document.getElementById('appbar');
    if (appbar) appbar.style.viewTransitionName = 'none';

    setCircleTransitionOrigin(e);

    /**
     * Adding the class 'theme-transition' and then removing it after the theme updates.
     * This is to prevent the transition used specifically for theme from being played
     * by other things, such as page navigation.
     */
    document.documentElement.classList.add('theme-transition');

    const transition = document.startViewTransition(() => {
      updateTheme();
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove('theme-transition');
      /**
       * Setting the AppBar back to its regular name so it won't transition
       * during navigation.
       */
      if (appbar) appbar.style.viewTransitionName = '';
    });
  }

  function toggleTheme(e: MouseEvent) {
    const browserDoesNotSupportViewTransition = !document.startViewTransition;
    if (browserDoesNotSupportViewTransition) {
      updateTheme();
    } else {
      transitionTheme(e);
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

    background-color: var(--clr-surface-1);
    color: var(--clr-text);
    outline: 1px solid var(--clr-surface-2);

    transition-property: background-color, color, outline;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button.color-scheme-toggle:hover {
    background-color: var(--clr-surface-2);
    color: var(--clr-primary);
    outline: 1px solid var(--clr-primary);
  }

  .icon {
    position: absolute;

    cursor: pointer;

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
