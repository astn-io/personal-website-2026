<script lang="ts">
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
  import { appBarState } from '@components/state/appBarState.svelte';
  import { handleDrawerToggle } from '@scripts/drawerUtils';
</script>

<div
  class="mobile-menu-toggle-container"
  data-floating={appBarState.isFloating}
  data-appbar-hidden={appBarState.isHidden}
  data-expanded={mobileMenuState.isActive}
>
  <button
    onclick={handleDrawerToggle}
    aria-expanded={mobileMenuState.isActive}
    title="Toggle Navigation Menu"
  >
    <span class="ri-menu-line mobile-menu-toggle-icon icon-open"></span>
    <span class="ri-close-large-line mobile-menu-toggle-icon icon-close"></span>
    <span class="visually-hidden">Toggle Navigation Menu</span>
  </button>
</div>

<style lang="scss">
  @use '../styles/variables.scss' as *;

  button {
    --size: 2.25rem;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--size);
    width: var(--size);

    font-size: 1.5rem;

    border: none;
    border-radius: 50%;

    outline-style: solid;
    outline-width: 0.15rem;

    background-color: transparent;
    outline-color: transparent;

    cursor: pointer;

    margin-left: auto;
    margin-right: 1rem;

    pointer-events: all;

    transition-property: background-color, color, outline-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button:hover {
    outline-color: var(--clr-surface-1);
    background-color: var(--clr-surface-1);
  }

  button:active {
    background-color: var(--clr-base-0);
    outline-color: var(--clr-surface-1);
  }

  button:focus {
    outline-color: var(--clr-text-0);
  }

  .mobile-menu-toggle-container {
    position: fixed;

    display: flex;
    align-items: center;
    justify-content: center;

    content: '';
    height: var(--appbar-height);
    width: 100vw;

    z-index: $z-index-drawer-toggle;

    pointer-events: none;

    transition-property: top;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .mobile-menu-toggle-container[data-appbar-hidden='true'][data-expanded='false'] {
    top: calc(var(--appbar-height) * -1 - 1px);
  }

  .mobile-menu-toggle-container[data-appbar-hidden='false'] {
    top: 1rem;
  }

  .mobile-menu-toggle-container[data-floating='false'][data-appbar-hidden='false'] {
    top: 0;
  }

  .mobile-menu-toggle-container[data-expanded='true'] {
    top: 0;
  }

  .mobile-menu-toggle-icon {
    position: absolute;

    transition-property: opacity, visibility, transform;
    transition-duration: 250ms;
    transition-timing-function: ease-out;
  }

  button[aria-expanded='false'] .icon-close {
    visibility: hidden;
    opacity: 0;
    transform: rotateZ(180deg) scale(0);
  }

  button[aria-expanded='false'] .icon-open {
    visibility: visible;
    opacity: 1;
    transform: rotateZ(0deg) scale(1);
  }

  button[aria-expanded='true'] {
    color: var(--clr-error);
    background-color: oklch(from var(--clr-error) l c h / 0.1);
    outline-color: oklch(from var(--clr-error) l c h / 0.2);
    top: 1rem;
  }

  button[aria-expanded='true']:hover {
    background-color: oklch(from var(--clr-error) l c h / 0.2);
    outline-color: oklch(from var(--clr-error) l c h / 0.3);
  }

  button[aria-expanded='true'] .icon-open {
    visibility: hidden;
    opacity: 0;
    transform: rotateZ(-180deg) scale(0);
  }

  button[aria-expanded='true'] .icon-close {
    visibility: visible;
    opacity: 1;
    transform: rotateZ(0deg) scale(1);
  }

  @media screen and (width > 760px) {
    .mobile-menu-toggle-container {
      display: none;
    }
  }
</style>
