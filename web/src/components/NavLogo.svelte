<a class="nav-logo-link" href="/" aria-label="Home">
  <svg
    class="nav-logo"
    width="255"
    height="256"
    viewBox="0 0 255 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M165.209 210.605H103.07L118.698 153.302H148.465L104.558 0H172.651L254.14 256H178.233L165.209 210.605Z"
      fill="var(--logo-clr-secondary)"
    />
    <path
      d="M87.814 0H81.4884L0 256H74.4186L117.209 101.953L87.814 0Z"
      fill="var(--logo-clr-primary)"
    />
  </svg>
</a>

<style lang="scss">
  a.nav-logo-link {
    position: relative;

    z-index: 1;
  }

  a.nav-logo-link::after {
    content: '';

    position: absolute;
    top: 50%;
    left: 50%;

    transform: translateX(-50%) translateY(-50%);

    width: 4.5rem;
    height: 4.5rem;

    background: radial-gradient(
      circle,
      oklch(from var(--clr-primary) l c h / 0.5) 0%,
      transparent 60%
    );

    opacity: 0;

    z-index: -1;

    transition: opacity 200ms ease-out;
  }

  a.nav-logo-link:hover::after {
    opacity: 1;
  }

  svg.nav-logo {
    --logo-size: 1.5rem;
    --logo-clr-bg: transparent;
    --logo-clr-primary: var(--clr-primary);
    --logo-clr-secondary: var(--clr-text-0);

    width: var(--logo-size);
    height: var(--logo-size);

    path {
      transition-property: fill;
      transition-duration: 200ms;
      transition-timing-function: ease-out;
    }
  }

  svg.nav-logo:hover {
    --logo-clr-bg: var(--clr-surface-2);
  }
</style>
