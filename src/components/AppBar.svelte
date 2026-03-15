<script lang="ts">
  import { onMount } from 'svelte';
  import LightToggle from './LightToggle.svelte';

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

<header id="appbar" data-hidden={isHidden}>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/blog">Blog</a>
    </li>
  </ul>
  <LightToggle></LightToggle>
</header>

<style>
  header {
    position: fixed;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: auto;

    width: 100%;
    min-height: 4rem;

    background-color: var(--clr-surface-1);

    z-index: 10;

    transition: top 0.3s ease-in-out;
    view-transition-name: appbar;
  }

  header[data-hidden='true'] {
    top: -4.2rem;
  }

  ul {
    display: flex;
    gap: 1rem;

    list-style: none;

    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
    padding: 0;
  }
</style>
