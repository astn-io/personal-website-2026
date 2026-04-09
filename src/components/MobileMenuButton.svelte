<button class="mobile-menu-btn" aria-label="Open Menu">
  <span class="ri-menu-line mobile-menu-btn-icon"></span>
</button>

<style>
  button {
    --size: 2.5rem;

    height: var(--size);
    width: var(--size);

    font-size: 1.5rem;

    border: none;
    border-radius: 4pt;

    cursor: pointer;

    background-color: var(--clr-surface-1);

    transition-property: backround-color, color, outline-color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button:hover {
    background-color: var(--clr-surface-2);
  }

  @media screen and (width > 600px) {
    button {
      display: none;
    }
  }
</style>
