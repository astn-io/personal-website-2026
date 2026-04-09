<script lang="ts">
  import type { Snippet } from '@astrojs/svelte/svelte-shims.d.ts';
  import { onMount, tick } from 'svelte';

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();

  let activeIndex = $state(0);
  let tabNames = $state<string[]>([]);
  let tabIcons = $state<(string | undefined)[]>([]);
  let indicator: HTMLSpanElement;
  let buttonGroup: HTMLDivElement;
  let tabContent: HTMLDivElement;
  let buttons: HTMLButtonElement[] = [];

  function discoverTabs() {
    const sections = tabContent.querySelectorAll<HTMLElement>('.tab-section');
    tabNames = Array.from(sections).map((s) => s.dataset.tabName!);
    tabIcons = Array.from(sections).map((s) => s.dataset.tabIcon);

    sections.forEach((s, i) => {
      s.dataset.tabId = String(i);
      s.dataset.active = i === 0 ? 'true' : 'false';
    });
  }

  function positionIndicator() {
    if (!indicator || !buttons[activeIndex]) return;

    const groupRect = buttonGroup.getBoundingClientRect();
    const btnRect = buttons[activeIndex].getBoundingClientRect();

    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${btnRect.left - groupRect.left}px)`;
  }

  function switchTab(newIndex: number) {
    if (newIndex === activeIndex) return;

    const direction = newIndex > activeIndex ? 'right' : 'left';

    const sections = tabContent.querySelectorAll<HTMLElement>('.tab-section');
    sections.forEach((s) => {
      s.dataset.active = 'false';
      delete s.dataset.direction;
    });

    const newSection = sections[newIndex];
    if (newSection) {
      newSection.dataset.active = 'true';
      requestAnimationFrame(() => {
        newSection.dataset.direction = direction;
      });
    }

    activeIndex = newIndex;
    positionIndicator();
  }

  onMount(() => {
    discoverTabs();
    tick().then(() => positionIndicator());
    window.addEventListener('resize', positionIndicator);
    return () => window.removeEventListener('resize', positionIndicator);
  });
</script>

<div class="tabbed-component-container">
  <div class="tab-btn-group" bind:this={buttonGroup}>
    {#each tabNames as name, i}
      <button
        class="tab-btn"
        data-active={i === activeIndex ? 'true' : 'false'}
        onclick={() => switchTab(i)}
        bind:this={buttons[i]}
      >
        {#if tabIcons[i]}<span class="{tabIcons[i]} tab-btn-icon"></span>{/if}
        <span>{name}</span>
      </button>
    {/each}
    <span class="tab-indicator" bind:this={indicator}></span>
  </div>
  <div class="tab-content" bind:this={tabContent}>
    {@render children?.()}
  </div>
</div>

<style>
  .tabbed-component-container {
    container-type: inline-size;
    display: grid;

    max-width: 100%;

    overflow: hidden;
  }

  .tab-btn-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;

    background-color: transparent;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5ch;

    padding-inline: 1.5rem;
    padding-block: 0.6rem;
    margin: 0;

    border: none;

    border-radius: 4pt 4pt 0 0;

    background-color: transparent;

    color: var(--clr-text-1);

    cursor: pointer;

    transition-property: background-color, color;
    transition-duration: 200ms;
    transition-timing-function: ease-out;
  }

  .tab-btn-icon {
    position: relative;
    top: 0.035rem;
  }

  .tab-btn:hover {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
  }

  .tab-btn[data-active='true'] {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
  }

  .tab-indicator {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;

    background-color: var(--clr-primary);

    transition:
      transform 250ms ease-out,
      width 250ms ease-out;
  }

  .tab-content {
    display: grid;
  }

  .tab-content :global(.tab-section) {
    grid-row: 1;
    grid-column: 1;
    align-self: start;

    background-color: var(--clr-surface-0);

    border-radius: 0 0 10pt 10pt;

    padding-top: 1rem;

    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms ease-out;
  }

  .tab-content :global(.tab-section[data-active='true']) {
    opacity: 1;
    pointer-events: auto;
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(30%);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-30%);
    }
  }

  @keyframes slide-in-top {
    from {
      opacity: 0;
      transform: translateY(-30%);
    }
  }

  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translateY(30%);
    }
  }

  .tab-content
    :global(.tab-section[data-active='true'][data-direction='right']) {
    animation: slide-in-right 250ms ease-out;
  }

  .tab-content
    :global(.tab-section[data-active='true'][data-direction='left']) {
    animation: slide-in-left 250ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .tab-indicator {
      transition: none;
    }

    .tab-content :global(.tab-section) {
      transition: none;
    }

    .tab-content
      :global(.tab-section[data-active='true'][data-direction='right']),
    .tab-content
      :global(.tab-section[data-active='true'][data-direction='left']) {
      animation: none;
    }
  }

  @container (width < 820px) {
    .tabbed-component-container {
      display: grid;
      overflow: visible;
    }

    .tab-btn-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: -1rem;

      padding-top: 1px;
      padding-inline: 1px;
    }

    .tab-btn {
      border-radius: 6pt;
      font-size: 0.85rem;
      letter-spacing: var(--letter-spacing-sm);
      padding-inline: 0.8rem;
      padding-block: 0.4rem;
    }

    .tab-btn[data-active='true'] {
      outline: 1px solid var(--clr-surface-1);
    }

    .tab-content :global(.tab-section) {
      border-radius: 10pt;
      background-color: transparent;
    }

    .tab-indicator {
      display: none;
    }

    .tab-content
      :global(.tab-section[data-active='true'][data-direction='right']) {
      animation: slide-in-bottom 250ms ease-out;
    }

    .tab-content
      :global(.tab-section[data-active='true'][data-direction='left']) {
      animation: slide-in-bottom 250ms ease-out;
    }
  }
</style>
