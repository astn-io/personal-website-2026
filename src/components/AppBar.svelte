<script>
  import { onMount, onDestroy } from 'svelte';

  const SCROLL_THRESHOLD = 80;

  let hidden = false;
  let lastScrollY = 0;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (delta > SCROLL_THRESHOLD) {
      hidden = true;
      lastScrollY = currentScrollY;
    } else if (delta < -SCROLL_THRESHOLD) {
      hidden = false;
      lastScrollY = currentScrollY;
    }
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onDestroy(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<header id="appbar" class:hidden>
  <ul>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/blog">Blog</a>
    </li>
  </ul>
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

    background-color: rgb(56, 56, 56);

    transition: top 0.3s ease-in-out;
  }

  header.hidden {
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
