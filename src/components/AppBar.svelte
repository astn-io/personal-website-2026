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
  });
</script>

<header
  id="appbar"
  data-hidden={isHidden}
  data-floating={isFloating}
  class="full-width content-grid"
>
  <div class="header-content">
    <NavLogo />
    <Navigation />
    <LightToggle />
  </div>
</header>

<style>
  header {
    position: fixed;
    top: 0;

    min-height: var(--appbar-height);

    background-color: var(--clr-surface-0);

    width: 100%;

    outline: 1px solid transparent;
    border-radius: 0%;

    z-index: 10;

    /* transition: top 0.3s ease-in-out; */
    transition-property: top, width, border-radius, outline;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
    view-transition-name: appbar;
  }

  header[data-hidden='true'] {
    top: calc(var(--appbar-height) * -1 + -1px);
  }

  header[data-floating='true'] {
    width: calc(var(--max-width) + 1rem);
    border-radius: var(--appbar-height);
    outline: 1px solid var(--clr-surface-1);
  }

  header[data-floating='true'][data-hidden='false'] {
    top: 1rem;
  }

  .header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1.5rem;
  }
</style>
