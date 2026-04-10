<script lang="ts">
  import FeaturedLink from '@components/FeaturedLink.svelte';
  import externalLinks from '@content/externalLinks.json';

  const links = externalLinks
    .flatMap((group) => group.links)
    .filter((link) => link.featured);

  type Props = {
    style?: 'button' | 'simple';
  };

  const { style = 'button' }: Props = $props();
</script>

<ul data-style={style}>
  {#each links as link}
    <li>
      <FeaturedLink
        {style}
        label={link.label}
        url={link.url}
        icon={link.icon}
      />
    </li>
  {/each}
</ul>

<style>
  ul {
    display: flex;
    align-items: center;
    justify-content: center;

    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  ul[data-style='button'] {
    gap: 1rem;
  }

  ul[data-style='simple'] {
    gap: 0.5rem;
  }
</style>
