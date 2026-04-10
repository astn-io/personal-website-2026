<script lang="ts">
  type Props = {
    url: string;
    icon: string;
    label: string;
  };

  const { url, icon, label }: Props = $props();
</script>

<a href={url} title={label}>
  <span class={`${icon}`}></span>
  <span class="visually-hidden">{label}</span>
</a>

<style>
  a {
    --link-size: 2.75rem;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--link-size);
    width: var(--link-size);

    padding: 0;
    margin: 0;

    aspect-ratio: 1;

    background-color: var(--clr-surface-1);

    border-radius: 50%;

    text-decoration: none;
    color: var(--clr-text-2);
    font-size: 1.4rem;

    outline: 2px solid var(--clr-surface-2);

    transition-property: color, background-color, outline;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a:hover {
    color: var(--clr-text-0);
    background-color: var(--clr-surface-2);
    outline: 2px solid var(--clr-overlay-0);
  }
</style>
