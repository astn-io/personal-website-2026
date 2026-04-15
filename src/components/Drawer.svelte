<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onMount } from 'svelte';
  import NavLogo from '@components/NavLogo.svelte';
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
  import { appBarState } from '@components/state/appBarState.svelte';
  import { handleDrawerToggle } from '@scripts/drawerUtils';

  type Props = {
    children?: Snippet;
  };

  const { children }: Props = $props();

  function setMobileMenuInactive() {
    mobileMenuState.isActive = false;
  }

  onMount(() => {
    document.addEventListener('astro:before-swap', setMobileMenuInactive);

    return () => {
      setMobileMenuInactive();
      document.removeEventListener('astro:before-swap', setMobileMenuInactive);
    };
  });

  let drawerEl: HTMLElement;

  function trapFocusInDrawer() {
    if (!mobileMenuState.isActive) return;

    const focusableSelector =
      'a[href]:not([data-active-path="true"]), button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

    function getFocusable() {
      return [...drawerEl.querySelectorAll<HTMLElement>(focusableSelector)];
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleDrawerToggle();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // If focus is outside the drawer, pull it in
      if (!drawerEl.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      // Wrap at boundaries
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeydown);

    // Focus the first focusable element when the drawer opens
    requestAnimationFrame(() => {
      const focusable = getFocusable();
      if (focusable.length > 0) focusable[0].focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }

  $effect(() => {
    trapFocusInDrawer();
  });
</script>

<!--
 Note: the `role="presentation"` is intentional.
 Despite this being a clickable element, the onclick is purely
 for the convenience of users who can see the overlay without
 screen reader assistance. There is already a button to toggle
 the mobile menu that is accesibility friendly (DrawerToggle.svelte)
-->
<div
  class="drawer-overlay"
  data-active={mobileMenuState.isActive}
  onclick={handleDrawerToggle}
  role="presentation"
></div>
<menu
  class="drawer-container"
  data-active={mobileMenuState.isActive}
  bind:this={drawerEl}
>
  <div class="logo-container" data-appbar-floating={appBarState.isFloating}>
    <NavLogo />
    <p class="drawer-header-title">Austin Hagel</p>
  </div>
  <div class="drawer-content">
    {@render children?.()}
  </div>
</menu>

<style lang="scss">
  @use '../styles/variables.scss' as *;

  .drawer-overlay {
    content: '';
    position: fixed;
    inset: 0;

    height: 100%;
    width: 100%;

    background-color: oklch(from var(--clr-base-2) l c h / 0.8);

    backdrop-filter: blur(8px);

    z-index: $z-index-drawer-overlay;

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

    z-index: $z-index-drawer;

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
    top: 0.5rem;

    display: flex;
    align-items: center;
    gap: 0.5rem;

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

  @media screen and (width > $width-mobile-1) {
    menu.drawer-container {
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
