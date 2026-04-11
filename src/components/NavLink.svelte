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
  a {
    position: relative;

    color: var(--clr-text-1);
    text-decoration: none;
    font-size: 1rem;
    letter-spacing: 0.015ch;

    font-weight: 500;

    transition-property: color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover {
    color: var(--clr-text-0);
  }

  a::after {
    content: '';
    position: absolute;
    bottom: -0.2rem;
    left: 0;

    height: 0.15rem;
    width: 0;

    background-color: var(--clr-text-0);

    transition-property: width;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover::after {
    width: 100%;
  }

  a[data-active-path='true'] {
    color: var(--clr-text-0);
    cursor: default;
    pointer-events: none;
  }

  a[data-active-path='true']::after {
    width: 100%;
    background-color: var(--clr-primary);
  }
</style>
