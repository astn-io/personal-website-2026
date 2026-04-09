<script lang="ts">
  type Props = {
    url: string;
    label: string;
    pathname: string;
  };

  let { url, label, pathname }: Props = $props();

  let active: boolean = $derived(pathname === url);
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

    color: var(--clr-text-0);
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
    color: var(--clr-text-2);
  }

  a[data-active-path='true']::after {
    width: 100%;
    background-color: var(--clr-text-2);
  }
</style>
