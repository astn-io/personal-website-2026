<script>
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
</script>

<div class="mobile-menu-container" data-active={mobileMenuState.isActive}></div>

<style>
  .mobile-menu-container {
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

    transition-property: transform, visibility;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  [data-active='false'] {
    visibility: hidden;
    pointer-events: none;
    transform: translateX(100%);
  }

  [data-active='true'] {
    visibility: visible;
    pointer-events: all;
    transform: translateX(0);
  }

  @media screen and (width > 600px) {
    .mobile-menu-container {
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
