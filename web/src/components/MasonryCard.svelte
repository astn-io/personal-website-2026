<script lang="ts">
  type Props = {
    image: string;
    imageAlt: string;
    title: string;
    category?: string;
    aspectRatio?: string;
    href?: string;
  };

  const {
    image,
    imageAlt,
    title,
    category,
    aspectRatio,
    href,
  }: Props = $props();
</script>

{#snippet body()}
  <div class="image-wrapper" style:aspect-ratio={aspectRatio}>
    <img src={image} alt={imageAlt} loading="lazy" />
  </div>
  <div class="card-body">
    {#if category}
      <span class="card-category">{category}</span>
    {/if}
    <h3 class="card-title">{title}</h3>
  </div>
{/snippet}

{#if href}
  <a class="masonry-card" data-scroll-animate {href}>
    {@render body()}
  </a>
{:else}
  <article class="masonry-card" data-scroll-animate>
    {@render body()}
  </article>
{/if}

<style lang="scss">
  .masonry-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 0.75rem;
    background: var(--clr-overlay-0);
    color: inherit;
    text-decoration: none;
    transition:
      transform 200ms ease-out,
      box-shadow 200ms ease-out;
  }

  a.masonry-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgb(0 0 0 / 0.18);
  }

  .image-wrapper {
    width: 100%;
    overflow: hidden;
    background: var(--clr-overlay-1);
  }

  img {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 400ms ease-out;
  }

  a.masonry-card:hover img {
    transform: scale(1.03);
  }

  .card-body {
    padding: 0.75rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .card-category {
    color: var(--clr-primary);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1ch;
  }

  .card-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: var(--clr-text-0);
  }

  @media (prefers-reduced-motion: no-preference) {
    .masonry-card[data-scroll-animate] {
      opacity: 0;
    }

    .masonry-card[data-scroll-animate]:global(.visible) {
      animation: masonry-fade-up 500ms ease-out forwards;
    }

    @keyframes masonry-fade-up {
      from {
        opacity: 0;
        transform: translateY(1.5rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>
