<script lang="ts">
  import { onMount } from 'svelte';
  import { Theme } from '@scripts/types';

  let current: string = $state(Theme.default);

  const options = [
    { value: Theme.default,    label: 'Default' },
    { value: Theme.catppuccin, label: 'Catppuccin' },
    { value: Theme.dracula,    label: 'Dracula' },
    { value: Theme.rosepine,   label: 'Rosé Pine' },
  ];

  function setTheme(theme: string) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    current = theme;
  }

  onMount(() => {
    const stored = localStorage.getItem('theme');
    if (stored === Theme.default || stored === Theme.catppuccin || stored === Theme.dracula || stored === Theme.rosepine) {
      current = stored;
    } else {
      current = document.documentElement.dataset.theme ?? Theme.default;
    }
  });
</script>

<label class="theme-select" for="theme-select-input">
  <span class="theme-label">Theme</span>
  <div class="select-wrapper">
    <select
      id="theme-select-input"
      value={current}
      onchange={(e) => setTheme((e.currentTarget as HTMLSelectElement).value)}
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    <span class="ri-arrow-down-s-line select-arrow" aria-hidden="true"></span>
  </div>
</label>

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

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  select {
    appearance: none;
    padding: 0.25rem 1.75rem 0.25rem 0.6rem;
    border-radius: 0.375rem;
    border: 1px solid var(--clr-surface-2);
    background-color: var(--clr-surface-0);
    color: var(--clr-text-1);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;

    transition:
      border-color 150ms ease-out,
      color 150ms ease-out,
      background-color 150ms ease-out;
  }

  select:hover {
    border-color: var(--clr-overlay-0);
    color: var(--clr-text-0);
  }

  select:focus {
    outline: 2px solid var(--clr-primary);
    outline-offset: 2px;
    border-color: transparent;
  }

  .select-arrow {
    position: absolute;
    right: 0.4rem;
    font-size: 0.9rem;
    color: var(--clr-text-2);
    pointer-events: none;
  }
</style>
