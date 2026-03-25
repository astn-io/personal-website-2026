<script lang="ts">
  import { onMount } from 'svelte';
  import LightToggle from '@components/LightToggle.svelte';
  import Navigation from '@components/Navigation.svelte';
  import NavLogo from '@components/NavLogo.svelte';

  const SCROLL_THRESHOLD = 140;

  type Hidden = 'true' | 'false';
  type Floating = 'true' | 'false';

  let isHidden = $state<Hidden>('false');
  let isFloating = $state<Floating>('false');
  let lastScrollY = 0;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (delta > SCROLL_THRESHOLD) {
      isHidden = 'true';
      lastScrollY = currentScrollY;
    } else if (delta < -SCROLL_THRESHOLD) {
      isHidden = 'false';
      lastScrollY = currentScrollY;
    }
  }

  function handleFloatTransition() {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      isFloating = entry.isIntersecting ? 'false' : 'true';
    });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }

  onMount(() => {
    handleFloatTransition();
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('astro:page-load', () => {
      handleFloatTransition();
    });
  });
</script>

<header id="appbar" data-hidden={isHidden} data-floating={isFloating}>
  <div class="header-content">
    <NavLogo />
    <Navigation />
    <LightToggle />
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

    z-index: 10;

    transition-property: top, width;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
    view-transition-name: appbar;
  }

  header[data-hidden='true'] {
    top: calc(var(--appbar-height) * -1 + -1px);
  }

  header[data-floating='true'] {
    width: calc(var(--max-width) + 1rem);
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
    outline: 1px solid var(--clr-surface-1);
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
    grid-template-columns: auto 1fr auto;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;

    width: 100%;
    max-width: var(--max-width);

    padding-inline: 1rem;
  }
</style>
