<a href="/" aria-label="Home">
  <svg
    class="navlogo"
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="256" cy="256" r="256" fill="var(--logo-clr-bg)" />
    <path
      d="M75.3359 259.109C75.3359 239.694 77.9208 221.691 83.0905 205.1C88.2602 188.332 96.2821 173.683 107.156 161.151C130.687 134.323 164.379 120.909 208.233 120.909H228.822V390.955H214.918C169.995 390.955 135.233 378.776 110.632 354.419C87.1015 331.121 75.3359 299.351 75.3359 259.109Z"
      fill="var(--logo-clr-primary)"
    />
    <path
      d="M416.002 120.91H268.398V286.379C268.398 323.797 278.649 350.625 299.149 366.863C319.471 382.925 352.807 390.956 399.156 390.956H416.002V120.91Z"
      fill="var(--logo-clr-secondary)"
    />
  </svg>
</a>

<style lang="scss">
  svg.navlogo {
    --logo-size: 2.8rem;
    --logo-clr-bg: var(--clr-base-2);
    --logo-clr-primary: var(--clr-primary);
    --logo-clr-secondary: var(--clr-text);

    width: var(--logo-size);
    height: var(--logo-size);

    border-radius: 50%;

    circle,
    path {
      transition-property: fill;
      transition-duration: 200ms;
      transition-timing-function: ease-out;
    }
  }

  svg.navlogo:hover {
    --logo-clr-bg: var(--clr-text);
    --logo-clr-primary: oklch(from var(--clr-primary) calc(l + 0.1) c h);
    --logo-clr-secondary: var(--clr-base-2);
  }
</style>
