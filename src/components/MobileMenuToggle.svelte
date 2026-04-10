<script>
  import { mobileMenuState } from '@components/state/mobileMenuState.svelte';
  import { appBarState } from '@components/state/appBarState.svelte';

  function handleClick() {
    mobileMenuState.isActive = !mobileMenuState.isActive;
  }
</script>

<div
  class="mobile-menu-toggle-container"
  data-floating={appBarState.isFloating}
  data-appbar-hidden={appBarState.isHidden}
>
  <button onclick={handleClick} aria-expanded={mobileMenuState.isActive}>
    <span class="ri-menu-line mobile-menu-toggle-icon icon-open"></span>
    <span class="ri-close-large-line mobile-menu-toggle-icon icon-close"></span>
    <span class="visually-hidden">Toggle Mobile Menu</span>
  </button>
</div>

<style>
  button {
    --size: 3rem;

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
    outline-color: var(--clr-surface-1);

    cursor: pointer;

    background-color: var(--clr-surface-0);

    margin-left: auto;
    margin-right: 1rem;

    transition-property: background-color, color, outline-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button:hover {
    background-color: var(--clr-surface-1);
    outline-color: var(--clr-overlay-2);
  }

  button:active {
    background-color: var(--clr-base-0);
    outline-color: var(--clr-surface-1);
  }

  .mobile-menu-toggle-container {
    position: fixed;

    display: flex;
    align-items: center;
    justify-content: center;

    content: '';
    height: var(--appbar-height);
    width: 100vw;

    z-index: 105;

    transition-property: top;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
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
    /* background-color: var(--clr-surface-1); */
    background-color: oklch(from var(--clr-error) l c h / 0.1);
    outline-color: oklch(from var(--clr-error) l c h / 0.2);
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

  [data-appbar-hidden='true'] {
    top: calc(var(--appbar-height) * -1 - 1px);
  }

  [data-appbar-hidden='false'] {
    top: 1rem;
  }

  [data-floating='false'][data-appbar-hidden='false'] {
    top: 0;
  }

  @media screen and (width > 600px) {
    .mobile-menu-toggle-container {
      display: none;
    }
  }
</style>
