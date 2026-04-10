<script lang="ts">
  import type { Snippet } from 'svelte';
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
  import { handleDrawerToggle } from '@scripts/drawerUtils';
  import { onMount, onDestroy } from 'svelte';

  type Props = {
    children?: Snippet;
  };

  const { children }: Props = $props();

  onMount(() => {
    document.addEventListener('astro:before-swap', () => {
      mobileMenuState.isActive = false;
    });
  });

  onDestroy(() => {
    mobileMenuState.isActive = false;
  });
</script>

<div
  class="drawer-overlay"
  data-active={mobileMenuState.isActive}
  onclick={handleDrawerToggle}
  role="presentation"
></div>
<menu class="drawer-container" data-active={mobileMenuState.isActive}>
  <div class="drawer-content">
    {@render children?.()}
  </div>
</menu>

<style>
  .drawer-overlay {
    content: '';
    position: fixed;
    inset: 0;

    height: 100%;
    width: 100%;

    background-color: oklch(from var(--clr-base-2) l c h / 0.8);

    backdrop-filter: blur(8px);

    z-index: 90;

    transition-property: opacity, visibility;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .drawer-overlay[data-active='true'] {
    opacity: 1;
    pointer-events: all;
    visibility: visible;
  }

  .drawer-overlay[data-active='false'] {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  menu.drawer-container {
    position: fixed;
    top: 0;
    right: 0;

    content: '';

    height: 100vh;
    width: calc(100vw - 5rem);
    max-width: 20rem;

    background-color: var(--clr-base-0);

    border-left: 0.1rem solid var(--clr-surface-2);

    z-index: 100;

    margin: 0;
    padding: 0;

    transition-property: transform, visibility;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  menu.drawer-container[data-active='false'] {
    visibility: hidden;
    pointer-events: none;
    transform: translateX(100%);
  }

  menu.drawer-container[data-active='true'] {
    visibility: visible;
    pointer-events: all;
    transform: translateX(0);
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    gap: 1rem;

    height: 100%;
    width: 100%;

    margin-top: calc(var(--appbar-height) + 1rem);
  }

  @media screen and (width > 600px) {
    menu.drawer-container {
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
