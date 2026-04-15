<script lang="ts">
  import { onMount } from 'svelte';
  import { Theme } from '@scripts/types';

  let current: string = $state(Theme.default);

  const options = [
    {
      value: Theme.default,
      label: 'Default',
      colors: ['oklch(0.72 0.179 260.7)', 'oklch(0.72 0.207 213)', 'oklch(0.727 0.265 303.9)'],
    },
    {
      value: Theme.catppuccin,
      label: 'Catppuccin',
      colors: ['#89b4fa', '#94e2d5', '#cba6f7'],
    },
  ];

  function setTheme(theme: string) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    current = theme;
  }

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === Theme.default || stored === Theme.catppuccin) {
      current = stored;
    } else {
      current = document.documentElement.dataset.theme ?? Theme.default;
    }
  });
</script>

<div class="theme-select">
  <span class="theme-label" id="theme-select-label">Theme</span>
  <div class="theme-options" role="radiogroup" aria-labelledby="theme-select-label">
    {#each options as option}
      <button
        role="radio"
        aria-checked={current === option.value}
        class="theme-option"
        data-active={current === option.value}
        onclick={() => setTheme(option.value)}
        title="Switch to {option.label} theme"
      >
        <span class="swatches" aria-hidden="true">
          {#each option.colors as color}
            <span class="swatch" style="background-color: {color}"></span>
          {/each}
        </span>
        {option.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .theme-select {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .theme-label {
    font-size: 0.675rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12ch;
    color: var(--clr-text-2);
  }

  .theme-options {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.2rem;
    background-color: var(--clr-base-1);
    border-radius: 0.5rem;
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: 0.45rem;

    padding: 0.25rem 0.6rem;
    border-radius: 0.3rem;
    border: none;
    background-color: transparent;
    cursor: pointer;

    font-size: 0.75rem;
    font-weight: 500;
    color: var(--clr-text-2);

    transition:
      background-color 150ms ease-out,
      color 150ms ease-out;
  }

  .theme-option:hover {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
  }

  .theme-option[data-active='true'] {
    background-color: var(--clr-surface-2);
    color: var(--clr-text-0);
  }

  .swatches {
    display: flex;
    gap: 2px;
  }

  .swatch {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
</style>
