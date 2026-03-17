<script lang="ts">
  let { url, label } = $props();
</script>

<a href={url}>{label}</a>

<style lang="scss">
  a {
    color: var(--clr-text);
    text-decoration: none;
    transition-property: color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  :global(:root[data-color-scheme='dark']) a:hover {
    color: oklch(from var(--clr-primary) calc(l + 0.2) c h);
  }

  :global(:root[data-color-scheme='light']) a:hover {
    color: oklch(from var(--clr-primary) l c h);
  }
</style>
