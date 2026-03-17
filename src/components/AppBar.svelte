<script lang="ts">
  import { onMount } from 'svelte';
  import LightToggle from '@components/LightToggle.svelte';
  import Navigation from '@components/Navigation.svelte';
  import NavLogo from '@components/NavLogo.svelte';

  const SCROLL_THRESHOLD = 80;

  type Hidden = 'true' | 'false';

  let isHidden = $state<Hidden>('false');
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

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });
</script>

<header id="appbar" data-hidden={isHidden} class="full-width content-grid">
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

    background-color: var(--clr-surface-1);

    width: 100%;

    z-index: 10;

    transition: top 0.3s ease-in-out;
    view-transition-name: appbar;
  }

  header[data-hidden='true'] {
    top: calc(var(--appbar-height) * -1 + -1px);
  }

  .header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
  }
</style>
