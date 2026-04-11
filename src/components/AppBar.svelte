<script lang="ts">
  import { onMount } from 'svelte';
  import LightToggle from '@components/LightToggle.svelte';
  import Navigation from '@components/Navigation.svelte';
  import NavLogo from '@components/NavLogo.svelte';
  import { appBarState } from '@components/state/appBarState.svelte';
  import SearchBar from './SearchBar.svelte';
  import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';
  import Button from './Button.svelte';

  const SCROLL_THRESHOLD = 100;

  let lastScrollY: number = 0;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (delta > SCROLL_THRESHOLD) {
      appBarState.isHidden = true;
      lastScrollY = currentScrollY;
    } else if (delta < -SCROLL_THRESHOLD) {
      appBarState.isHidden = false;
      lastScrollY = currentScrollY;
    }
  }

  let isNavigating: boolean = false;

  $effect(() => {
    document.documentElement.dataset.appbarHidden = String(
      appBarState.isHidden,
    );
  });

  function handleFloatTransition() {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) {
      console.error(
        'There is no sentinel for the intersection observer for the AppBar!',
      );
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (isNavigating) return;
      appBarState.isFloating = !entry.isIntersecting;
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }

  function prepareAppBarState(e: TransitionBeforePreparationEvent) {
    isNavigating = true;
    if (appBarState.isFloating === true) {
      appBarState.isFloating = false;
      appBarState.isHidden = false;
      const originalLoader = e.loader;
      e.loader = async () => {
        await new Promise((r) => setTimeout(r, 200));
        return originalLoader();
      };
    }
  }

  function handleAfterSwap() {
    appBarState.isFloating = false;
    appBarState.isHidden = false;
    document.documentElement.dataset.appbarHidden = String(
      appBarState.isHidden,
    );
  }

  let cleanupFloatTransition: (() => void) | undefined;

  function handlePageLoad() {
    isNavigating = false;
    cleanupFloatTransition?.();
    cleanupFloatTransition = handleFloatTransition();
  }

  onMount(() => {
    cleanupFloatTransition = handleFloatTransition();
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('astro:before-preparation', prepareAppBarState);
    document.addEventListener('astro:after-swap', handleAfterSwap);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      cleanupFloatTransition?.();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener(
        'astro:before-preparation',
        prepareAppBarState,
      );
      document.removeEventListener('astro:after-swap', handleAfterSwap);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  });
</script>

<header
  id="appbar"
  data-hidden={appBarState.isHidden}
  data-floating={appBarState.isFloating}
>
  <div class="header-content">
    <NavLogo />
    <Navigation />
    <SearchBar />
    <LightToggle onMobile={false} />
    <div class="contact-button-container">
      <Button
        icon="ri-chat-1-line"
        iconPosition="right"
        size="small"
        variant="secondary"
      >
        <span>Contact Austin</span>
      </Button>
    </div>
  </div>
</header>

<style>
  header {
    isolation: isolate;

    position: fixed;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    min-height: var(--appbar-height);

    width: 100%;

    z-index: 50;

    padding-inline: 1rem;

    transition-property: top, width;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
    view-transition-name: appbar;
  }

  header[data-hidden='true'] {
    top: calc(var(--appbar-height) * -1 - 1px);
  }

  header[data-floating='true'] {
    width: min(calc(var(--max-width) - 1rem), calc(100% - 1rem));

    backdrop-filter: blur(12px);

    border-radius: var(--appbar-height);
    outline: 1px solid var(--clr-surface-2);
  }

  header::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 100%;

    outline: 1px solid transparent;
    border-radius: 0%;
    border-bottom: 1px solid var(--clr-surface-1);

    background-color: var(--clr-surface-0);

    transition-property: border-radius, outline, background-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;

    z-index: -1;
  }

  header[data-floating='true']::after {
    backdrop-filter: blur(12px);
    background-color: oklch(from var(--clr-base-2) l c h / 0.8);

    border-radius: var(--appbar-height);
    border: none;
  }

  header[data-floating='false']::after {
    backdrop-filter: none;
    background-color: var(--clr-surface-0);
  }

  header[data-floating='true'][data-hidden='false'] {
    top: 1rem;
  }

  .header-content {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) auto auto;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    width: 100%;
    max-width: var(--max-width);
  }

  .header-content :global(:nth-child(3)) {
    justify-self: center;
  }

  @media screen and (width < 600px) {
    .header-content {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0;
    }

    .header-content :global(:nth-child(1)) {
      justify-self: start;
    }

    .header-content :global(:nth-child(2)) {
      justify-self: center;
    }

    .contact-button-container {
      display: none;
    }
  }
</style>
