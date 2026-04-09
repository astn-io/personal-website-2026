<div class="mobile-menu-toggle-container">
  <input type="checkbox" id="mobile-menu-toggle" name="mobile-menu-toggle" />
  <label for="mobile-menu-toggle" title="Toggle Mobile Menu">
    <span class="ri-menu-line mobile-menu-toggle-icon icon-open"></span>
    <span class="ri-close-large-line mobile-menu-toggle-icon icon-close"></span>
    <span class="visually-hidden">Toggle Mobile Menu</span>
  </label>
</div>

<style>
  input {
    display: none;
  }

  label {
    --size: 2.5rem;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--size);
    width: var(--size);

    font-size: 1.5rem;

    border: none;
    border-radius: 4pt;

    outline-style: solid;
    outline-width: 0.15rem;
    outline-color: var(--clr-surface-2);

    cursor: pointer;

    background-color: var(--clr-surface-1);

    transition-property: background-color, color, outline-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  label:hover {
    background-color: var(--clr-surface-2);
    outline-color: var(--clr-overlay-1);
  }

  label:active {
    background-color: var(--clr-base-0);
    outline-color: var(--clr-surface-2);
  }

  input ~ label .icon-close {
    display: none;
  }

  input:checked ~ label .icon-open {
    display: none;
  }

  input:checked ~ label .icon-close {
    display: flex;
  }

  @media screen and (width > 600px) {
    .mobile-menu-toggle-container {
      display: none;
    }
  }
</style>
