<script lang="ts">
  type Props = {
    style?: 'button' | 'simple';
    url: string;
    icon: string;
    label: string;
  };

  const { style = 'button', url, icon, label }: Props = $props();
</script>

<a href={url} title={label} data-style={style}>
  <span class={`${icon}`}></span>
  <span class="visually-hidden">{label}</span>
</a>

<style>
  a {
    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--link-size);
    width: var(--link-size);

    padding: 0;
    margin: 0;

    aspect-ratio: 1;

    border-radius: 50%;

    text-decoration: none;
    font-size: 1.4rem;

    outline-width: 0.15rem;
    outline-style: solid;

    transition-property: color, background-color, outline-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  a[data-style='button']:focus,
  a[data-style='simple']:focus {
    outline-color: var(--clr-text-0);
  }

  a[data-style='button'] {
    --link-size: 2.75rem;

    color: var(--clr-text-1);
    background-color: var(--clr-surface-0);
    outline-color: transparent;
  }

  a[data-style='button']:hover {
    color: var(--clr-text-0);
    background-color: var(--clr-surface-1);
    outline-color: var(--clr-primary);
  }

  a[data-style='simple'] {
    --link-size: 2.5rem;

    color: var(--clr-text-2);
    background-color: transparent;
    outline-color: transparent;
  }

  a[data-style='simple']:hover {
    color: var(--clr-text-0);
    background-color: var(--clr-surface-0);
    outline: 2px solid var(--clr-surface-1);
  }
</style>
