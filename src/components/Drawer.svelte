<script lang="ts">
  import type { Snippet } from 'svelte';
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
  import { appBarState } from '@components/state/appBarState.svelte';
  import { handleDrawerToggle } from '@scripts/drawerUtils';
  import { onMount, onDestroy } from 'svelte';
  import NavLogo from './NavLogo.svelte';

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
  <div class="logo-container" data-appbar-floating={appBarState.isFloating}>
    <NavLogo />
    <p class="drawer-header-title">Austin Hagel</p>
  </div>
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

    display: flex;
    flex-direction: column;

    height: 100dvh;
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

  .logo-container {
    position: relative;
    top: 0rem;

    display: flex;
    align-items: center;
    gap: 0.25rem;

    padding-block: 0.5rem;
    padding-left: 0.5rem;

    width: 100%;
  }

  .drawer-header-title {
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 0.25ch;
    color: var(--clr-text-2);
    font-size: 1rem;

    margin: 0;
  }

  .drawer-content {
    flex: 1;
    width: 100%;

    min-height: 0;
  }

  @media screen and (width > 600px) {
    menu.drawer-container {
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
