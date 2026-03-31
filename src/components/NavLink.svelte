<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    url: string;
    label: string;
    pathname: string;
  };

  let { url, label, pathname }: Props = $props();

  const paths = {
    '/': 'home',
    '/about': 'about',
    '/projects': 'projects',
    '/blog': 'blog',
    '/testing': 'testing',
  };

  let active: boolean = $derived(
    paths[pathname as keyof typeof paths]?.toLowerCase() ===
      label.toLowerCase(),
  );

  function updateActivePath() {
    active =
      paths[pathname as keyof typeof paths]?.toLowerCase() ===
      label.toLowerCase();
  }

  onMount(() => {
    document.addEventListener('astro:page-load', () => {
      updateActivePath();
    });
  });
</script>

<a href={url} data-active-path={active}>{label}</a>

<style lang="scss">
  :global(:root[data-color-scheme='dark']) a {
    --clr-hover: oklch(from var(--clr-primary) calc(l + 0.05) c h);
  }

  :global(:root[data-color-scheme='light']) a {
    --clr-hover: oklch(from var(--clr-primary) l c h);
  }

  a {
    position: relative;

    color: var(--clr-text);
    text-decoration: none;

    font-weight: 500;

    transition-property: color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover {
    color: var(--clr-hover);
  }

  a::after {
    content: '';
    position: absolute;
    bottom: -0.2rem;
    left: 0;

    height: 0.15rem;
    width: 0;

    background-color: var(--clr-hover);

    transition-property: width;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover::after {
    width: 100%;
  }

  a[data-active-path='true'] {
    color: var(--clr-subtext-1);
  }

  a[data-active-path='true']::after {
    width: 100%;
    background-color: var(--clr-subtext-1);
  }
</style>
