<script lang="ts">
  type Props = {
    url: string;
    label: string;
    pathname: string;
    icon?: string;
  };

  let { url, label, pathname, icon }: Props = $props();

  let active: boolean = $derived(pathname === url);
</script>

<a
  href={url}
  data-active-path={active}
  aria-current={active ? 'page' : 'false'}
>
  {#if icon}
    <span class={`${icon} link-icon`}></span>
  {/if}
  <span>{label}</span>
</a>

<style lang="scss">
  :global(:root[data-color-scheme='dark']) a {
    --clr-hover: var(--clr-text-0);
  }

  :global(:root[data-color-scheme='light']) a {
    --clr-hover: var(--clr-text-0);
  }

  a {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: start;
    gap: 1ch;

    color: var(--clr-text-2);
    text-decoration: none;
    font-weight: 500;
    font-size: 1.25rem;

    width: 100%;

    background-color: transparent;

    padding-block: 0.4rem;
    padding-left: 1rem;

    transition-property: color, background-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover {
    color: var(--clr-hover);
    background-color: var(--clr-surface-0);
  }

  a::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    height: 100%;
    width: 0;

    opacity: 0;

    background-color: var(--clr-hover);

    transition-property: opacity, width;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover::after {
    opacity: 1;
    width: 0.16rem;
  }

  a[data-active-path='true'] {
    color: var(--clr-primary);
    opacity: 0.8;
    cursor: default;
    pointer-events: none;

    background-color: var(--clr-base-1);
  }

  a[data-active-path='true']::after {
    background-color: var(--clr-primary);

    opacity: 1;
    width: 0.16rem;
  }

  .link-icon {
    font-size: 1.75rem;
  }
</style>
