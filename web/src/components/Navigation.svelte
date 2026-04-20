<script lang="ts">
  import { onMount } from 'svelte';
  import NavLink from './NavLink.svelte';
  import internalLinks from '@content/internal-links/internalLinks.json';

  type NavLinkType = {
    url: string;
    label: string;
  };

  const navLinks: NavLinkType[] = internalLinks;

  let pathname: string = $state('');

  function updatePathname(): void {
    pathname = window.location.pathname;
    pathname = '/' + pathname.split('/').filter(Boolean)[0];

    if (pathname === '/undefined' || pathname === undefined) {
      pathname = '/';
    }
  }

  onMount(() => {
    updatePathname();
    document.addEventListener('astro:page-load', updatePathname);

    return () => {
      document.removeEventListener('astro:page-load', updatePathname);
    };
  });
</script>

<nav>
  <ul>
    {#each navLinks as navLink}
      <NavLink url={navLink.url} label={navLink.label} {pathname} />
    {/each}
  </ul>
</nav>

<style>
  nav {
    min-width: 0;
  }

  ul {
    display: flex;
    gap: 1rem;

    list-style: none;

    margin: 0;
    padding: 0;
  }

  @media screen and (width < 760px) {
    nav {
      display: none;
    }
  }
</style>
