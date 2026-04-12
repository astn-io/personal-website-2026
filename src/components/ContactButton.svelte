<script lang="ts">
  import { btnIconPos } from '@scripts/types';

  type Props = {
    size?: 'small' | 'medium';
    icon?: string;
    iconAnimate?: boolean;
    iconPosition?: btnIconPos;
  };

  const {
    size = 'medium',
    icon,
    iconAnimate = true,
    iconPosition = btnIconPos.left,
  }: Props = $props();
</script>

<button
  type="button"
  class={`btn btn-${size}`}
  data-style="button"
  commandfor="contact-dialog"
  command="show-modal"
>
  {#if icon && iconPosition === btnIconPos.left}
    <span class={`btn-icon icon-left ${icon}`} data-icon-animate={iconAnimate}
    ></span>
  {/if}
  <span>Contact Me</span>
  {#if icon && iconPosition === btnIconPos.right}
    <span class={`btn-icon icon-right ${icon}`} data-icon-animate={iconAnimate}
    ></span>
  {/if}
</button>

<style>
  /* --- Secondary --- */
  :global(:root[data-color-scheme='dark']) .btn {
    --btn-clr-bg: oklch(from var(--clr-base-0) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-base-0) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-base-0) calc(l - 0.1) c h);

    --btn-clr-outline: oklch(from var(--clr-surface-0) calc(l + 0.1) c h);
    --btn-clr-outline-hover: oklch(from var(--clr-surface-0) calc(l + 0.2) c h);
    --btn-clr-outline-active: oklch(
      from var(--clr-surface-0) calc(l - 0.2) c h
    );

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  :global(:root[data-color-scheme='light']) .btn {
    --btn-clr-bg: oklch(from var(--clr-overlay-0) l c h);
    --btn-clr-bg-hover: oklch(from var(--clr-overlay-0) calc(l + 0.1) c h);
    --btn-clr-bg-active: oklch(from var(--clr-overlay-0) calc(l - 0.1) c h);

    --btn-clr-outline: oklch(from var(--clr-overlay-2) l c h);
    --btn-clr-outline-hover: oklch(from var(--clr-overlay-2) calc(l + 0.2) c h);
    --btn-clr-outline-active: oklch(
      from var(--clr-overlay-2) calc(l - 0.2) c h
    );

    --btn-clr-text: var(--clr-text-0);
    --btn-clr-text-hover: var(--clr-text-0-hover);
  }

  .btn {
    --btn-font-weight: 500;
  }

  button.btn {
    display: flex;
    align-items: center;
    justify-content: center;

    width: fit-content;

    font-weight: var(--btn-font-weight);
    color: var(--btn-clr-text);
    text-decoration: none;
    letter-spacing: 0.015ch;

    border: none;

    outline-width: 2px;
    outline-style: solid;
    outline-color: inherit;

    cursor: pointer;

    transition-property: background-color, outline, color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  button.btn:focus {
    outline-color: var(--clr-text-0);
  }

  button.btn.btn-medium[data-style='button'] {
    padding-inline: 1rem;
    padding-block: 0.75rem;
  }

  button.btn.btn-small[data-style='button'] {
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
  }

  button.btn[data-style='button'] {
    outline: 2px solid var(--btn-clr-outline);
    border-radius: 2pt;

    background-color: var(--btn-clr-bg);
  }

  button.btn[data-style='button']:hover {
    background-color: var(--btn-clr-bg-hover);
    color: var(--btn-clr-text-hover);
    outline: 2px solid var(--btn-clr-outline-hover);
  }

  button.btn[data-style='button']:active {
    background-color: var(--btn-clr-bg-active);
    outline: 2px solid var(--btn-clr-outline-active);
  }

  span.btn-icon {
    position: relative;

    font-size: 1.25rem;

    transition-property: transform;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .icon-right {
    margin-left: 0.25rem;
  }

  .icon-left {
    margin-right: 0.25rem;
  }

  button.btn:hover > .btn-icon[data-icon-animate='true'] {
    transform: rotateZ(-30deg);
  }
</style>
