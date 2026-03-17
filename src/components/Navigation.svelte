<script lang="ts">
  import NavLink from './NavLink.svelte';

  type NavLinkType = {
    url: string;
    label: string;
  };

  const navLinks: NavLinkType[] = [
    {
      url: '/',
      label: 'Home',
    },
    {
      url: '/about',
      label: 'About',
    },
    {
      url: '/blog',
      label: 'Blog',
    },
    {
      url: '/projects',
      label: 'Projects',
    },
  ];
</script>

<nav>
  <ul>
    {#each navLinks as navLink}
      <NavLink url={navLink.url} label={navLink.label} />
    {/each}
  </ul>
</nav>

<style>
  ul {
    display: flex;
    gap: 1.4rem;

    list-style: none;

    margin: 0;
    padding: 0;
  }
</style>
