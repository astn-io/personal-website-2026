<script lang="ts">
  type Props = {
    url: string;
    label: string;
    pathname: string;
  };

  let { url, label, pathname }: Props = $props();

  let active: boolean = $derived(pathname === url);
</script>

<a href={url} data-active-path={active} aria-current={active ? 'page' : 'false'}
  >{label}</a
>

<style lang="scss">
  a {
    position: relative;

    color: var(--clr-text-1);
    text-decoration: none;
    font-size: 0.85rem;
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
    bottom: -0.25rem;
    left: 0;

    height: 0.085rem;
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
  }

  a[data-active-path='true']:hover {
    color: var(--clr-primary);
  }

  a[data-active-path='true']::after {
    width: 100%;
    background-color: var(--clr-primary);
  }
</style>
