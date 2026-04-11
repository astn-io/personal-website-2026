<script lang="ts">
  import { onMount } from 'svelte';
  import DrawerNavLink from './DrawerNavLink.svelte';
  import internalLinks from '@content/internalLinks.json';

  type NavLinkType = {
    url: string;
    label: string;
    icon: string;
  };

  const navLinks: NavLinkType[] = internalLinks;

  let pathname: string = $state('');

  function updatePathname(): void {
    pathname = window.location.pathname;
    pathname = '/' + pathname.split('/').filter(Boolean)[0];

    if (pathname === '/undefined') {
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
      <DrawerNavLink
        url={navLink.url}
        label={navLink.label}
        {pathname}
        icon={navLink.icon}
      />
    {/each}
  </ul>
</nav>

<style>
  nav {
    display: flex;
    align-items: center;

    width: 100%;
  }

  ul {
    display: flex;
    flex-direction: column;

    list-style: none;

    margin: 0;
    padding: 0;

    width: 100%;
  }
</style>
