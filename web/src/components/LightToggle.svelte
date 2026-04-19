<script lang="ts">
  import { ColorScheme } from '@scripts/types';
  import { onMount } from 'svelte';

  type Props = {
    onMobile?: boolean;
  };

  const { onMobile = false }: Props = $props();

  let currentMode: ColorScheme = $state(ColorScheme.light);

  function setTheme(theme: ColorScheme) {
    document.documentElement!.dataset.colorScheme = theme;
    localStorage.setItem('colorScheme', theme);
    currentMode = theme;
  }

  function updateTheme() {
    if (document.documentElement!.dataset.colorScheme === ColorScheme.light) {
      setTheme(ColorScheme.dark);
      window.updateFavicons?.(ColorScheme.dark);
    } else {
      setTheme(ColorScheme.light);
      window.updateFavicons?.(ColorScheme.light);
    }
  }

  /**
   * This is specificly for the circle-in-top-right transition that plays.
   * This is to set the origin of the circle to the location of the light toggle button.
   */
  function setCircleTransitionOrigin(e: MouseEvent) {
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

    transition.finished.finally(() => {
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
    const storedTheme = localStorage.getItem('colorScheme');

    if (storedTheme === ColorScheme.light || storedTheme === ColorScheme.dark) {
      currentMode = storedTheme;
    } else {
      currentMode = window.matchMedia('(prefers-color-scheme: light)').matches
        ? ColorScheme.light
        : ColorScheme.dark;
    }
  });
</script>

<button
  class="color-scheme-toggle"
  onclick={toggleTheme}
  title={`Toggle ${currentMode === ColorScheme.light ? 'Dark' : 'Light'} Mode`}
  data-on-mobile={onMobile}
>
  <span class="icon icon-light ri-sun-fill"></span>
  <span class="icon icon-dark ri-moon-clear-fill"></span>
</button>

<style>
  button.color-scheme-toggle {
    --size: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    width: var(--size);
    height: var(--size);

    border-radius: 50%;
    border: none;

    cursor: pointer;

    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
    outline: 2px solid var(--clr-surface-2);

    transition-property: background-color, color, outline;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button.color-scheme-toggle:focus {
    outline-color: var(--clr-text-2);
  }

  button.color-scheme-toggle[data-on-mobile='true'] {
    --size: 2.75rem;
  }

  button.color-scheme-toggle[data-on-mobile='true'] .icon {
    font-size: 1.5rem;
  }

  button.color-scheme-toggle:hover {
    background-color: var(--clr-surface-2);
    color: var(--clr-text-0);
    outline: 2px solid var(--clr-overlay-0);
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

  @media screen and (width < 760px) {
    button.color-scheme-toggle[data-on-mobile='false'] {
      display: none;
    }
  }
</style>
