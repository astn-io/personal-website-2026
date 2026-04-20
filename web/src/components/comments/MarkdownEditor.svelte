<script lang="ts">
  import { renderMarkdown } from '@scripts/comments/markdown';

  type Props = {
    value?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    id?: string;
  };

  let {
    value = $bindable(''),
    placeholder = 'Write a comment…',
    rows = 4,
    disabled = false,
    id,
  }: Props = $props();

  let mode = $state<'write' | 'preview'>('write');
  let textareaEl = $state<HTMLTextAreaElement | null>(null);
  let showHeadingMenu = $state(false);
  let headingDropdownEl = $state<HTMLDivElement | null>(null);

  const HEADING_LEVELS = [
    { label: 'H1', prefix: '# ' },
    { label: 'H2', prefix: '## ' },
    { label: 'H3', prefix: '### ' },
    { label: 'H4', prefix: '#### ' },
  ];

  $effect(() => {
    if (!showHeadingMenu) return;
    function onClickOutside(e: MouseEvent) {
      if (headingDropdownEl && !headingDropdownEl.contains(e.target as Node)) {
        showHeadingMenu = false;
      }
    }
    window.addEventListener('click', onClickOutside, { capture: true });
    return () => window.removeEventListener('click', onClickOutside, { capture: true });
  });

  const previewHtml = $derived(mode === 'preview' ? renderMarkdown(value) : '');

  type WrapAction = {
    before: string;
    after: string;
    defaultText: string;
    blockPrefix?: boolean;
  };

  function applyWrap({ before, after, defaultText, blockPrefix = false }: WrapAction) {
    const ta = textareaEl;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    let selected = value.substring(start, end) || defaultText;
    let insertBefore = before;

    if (blockPrefix) {
      // For block-level formatting (code blocks), insert on a new line
      const beforeCursor = value.substring(0, start);
      if (beforeCursor.length > 0 && !beforeCursor.endsWith('\n')) {
        insertBefore = '\n' + before;
      }
    }

    const newValue =
      value.substring(0, start) + insertBefore + selected + after + value.substring(end);
    value = newValue;

    const selStart = start + insertBefore.length;
    const selEnd = selStart + selected.length;

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  }

  const ACTIONS = [
    {
      icon: 'ri-bold',
      label: 'Bold',
      action: () => applyWrap({ before: '**', after: '**', defaultText: 'bold text' }),
    },
    {
      icon: 'ri-italic',
      label: 'Italic',
      action: () => applyWrap({ before: '*', after: '*', defaultText: 'italic text' }),
    },
    {
      icon: 'ri-strikethrough',
      label: 'Strikethrough',
      action: () => applyWrap({ before: '~~', after: '~~', defaultText: 'strikethrough' }),
    },
    { separator: true },
    {
      icon: 'ri-code-line',
      label: 'Inline code',
      action: () => applyWrap({ before: '`', after: '`', defaultText: 'code' }),
    },
    {
      icon: 'ri-code-block',
      label: 'Code block',
      action: () =>
        applyWrap({
          before: '```\n',
          after: '\n```',
          defaultText: 'code here',
          blockPrefix: true,
        }),
    },
    { separator: true },
    {
      icon: 'ri-link',
      label: 'Link',
      action: () => applyWrap({ before: '[', after: '](url)', defaultText: 'link text' }),
    },
    {
      icon: 'ri-list-unordered',
      label: 'Bulleted list',
      action: () => applyWrap({ before: '- ', after: '', defaultText: 'item' }),
    },
    {
      icon: 'ri-double-quotes-l',
      label: 'Quote',
      action: () => applyWrap({ before: '> ', after: '', defaultText: 'quoted text' }),
    },
  ] as const;
</script>

<div class="markdown-editor">
  <div class="editor-toolbar">
    <div class="toolbar-actions">
      {#each ACTIONS as item}
        {#if 'separator' in item}
          <span class="toolbar-sep" aria-hidden="true"></span>
        {:else}
          <button
            type="button"
            class="toolbar-btn"
            title={item.label}
            aria-label={item.label}
            disabled={disabled || mode === 'preview'}
            onclick={item.action}
          >
            <span class={item.icon}></span>
          </button>
        {/if}
      {/each}

      <span class="toolbar-sep" aria-hidden="true"></span>

      <div class="heading-dropdown" bind:this={headingDropdownEl}>
        <button
          type="button"
          class="toolbar-btn heading-toggle"
          title="Heading"
          aria-label="Heading"
          aria-haspopup="true"
          aria-expanded={showHeadingMenu}
          disabled={disabled || mode === 'preview'}
          onclick={() => (showHeadingMenu = !showHeadingMenu)}
        >
          <span class="ri-heading"></span>
          <span class="ri-arrow-down-s-fill heading-arrow"></span>
        </button>
        {#if showHeadingMenu}
          <div class="heading-menu" role="menu">
            {#each HEADING_LEVELS as level}
              <button
                type="button"
                role="menuitem"
                class="heading-option"
                onclick={() => {
                  applyWrap({ before: level.prefix, after: '', defaultText: 'Heading' });
                  showHeadingMenu = false;
                }}
              >
                {level.label}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="tab-group" role="tablist">
      <button
        type="button"
        role="tab"
        class="tab-btn"
        class:active={mode === 'write'}
        aria-selected={mode === 'write'}
        onclick={() => (mode = 'write')}
      >
        Write
      </button>
      <button
        type="button"
        role="tab"
        class="tab-btn"
        class:active={mode === 'preview'}
        aria-selected={mode === 'preview'}
        onclick={() => (mode = 'preview')}
        disabled={!value.trim()}
      >
        Preview
      </button>
    </div>
  </div>

  {#if mode === 'write'}
    <textarea
      bind:this={textareaEl}
      bind:value
      {id}
      {rows}
      {placeholder}
      {disabled}
      class="editor-textarea"
    ></textarea>
  {:else}
    <div class="editor-preview markdown-body" role="tabpanel">
      {#if previewHtml}
        {@html previewHtml}
      {:else}
        <p class="preview-empty">Nothing to preview.</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .markdown-editor {
    display: flex;
    flex-direction: column;

    border: 1.5px solid var(--clr-surface-1);
    border-radius: 6px;

    background-color: var(--clr-surface-0);

    transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
  }

  .markdown-editor:focus-within {
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 3px oklch(from var(--clr-primary) l c h / 0.12);
  }

  /* ---- Toolbar ---- */
  .editor-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    padding: 0.35rem 0.5rem;

    border-bottom: 1px solid var(--clr-surface-1);
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 0.1rem;
    flex-wrap: wrap;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 1.75rem;
    height: 1.75rem;

    border: none;
    border-radius: 4px;

    background-color: transparent;
    color: var(--clr-text-2);
    font-size: 0.95rem;

    cursor: pointer;
    transition:
      background-color 120ms ease-out,
      color 120ms ease-out;
  }

  .toolbar-btn:hover:not(:disabled) {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-0);
  }

  .toolbar-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .toolbar-sep {
    display: inline-block;
    width: 1px;
    height: 1.1rem;
    background-color: var(--clr-surface-1);
    margin-inline: 0.2rem;
  }

  /* ---- Tabs ---- */
  .tab-group {
    display: flex;
    gap: 0.15rem;
    flex-shrink: 0;
  }

  .tab-btn {
    padding: 0.2rem 0.6rem;

    border: none;
    border-radius: 4px;

    background-color: transparent;
    color: var(--clr-text-2);
    font-family: inherit;
    font-size: 0.75rem;
    font-weight: 600;

    cursor: pointer;
    transition:
      background-color 120ms ease-out,
      color 120ms ease-out;
  }

  .tab-btn:hover:not(:disabled) {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
  }

  .tab-btn.active {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-0);
  }

  .tab-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* ---- Textarea ---- */
  .editor-textarea {
    font-family: inherit;
    font-size: 0.9rem;

    padding: 0.5rem 0.7rem;

    border: none;
    border-radius: 0 0 6px 6px;
    outline: none;

    background-color: transparent;
    color: var(--clr-text-0);

    resize: vertical;
    min-height: 4rem;
    width: 100%;
    box-sizing: border-box;
  }

  .editor-textarea::placeholder {
    color: var(--clr-text-2);
    opacity: 0.6;
  }

  /* ---- Preview ---- */
  .editor-preview {
    padding: 0.625rem 0.75rem;
    min-height: 4rem;
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--clr-text-1);
  }

  .preview-empty {
    color: var(--clr-text-2);
    font-style: italic;
    margin: 0;
  }

  /* ---- Heading dropdown ---- */
  .heading-dropdown {
    position: relative;
  }

  .heading-toggle {
    display: flex;
    align-items: center;
    gap: 0.05rem;
    width: auto;
    padding-inline: 0.3rem;
  }

  .heading-arrow {
    font-size: 0.7rem;
    opacity: 0.7;
  }

  .heading-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    z-index: 50;

    display: flex;
    flex-direction: column;

    min-width: 3.5rem;
    padding: 0.25rem;

    background-color: var(--clr-base-0);
    border: 1.5px solid var(--clr-surface-1);
    border-radius: 6px;
    box-shadow: 0 4px 12px oklch(from var(--clr-base-2) l c h / 0.25);
  }

  .heading-option {
    padding: 0.3rem 0.5rem;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--clr-text-1);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    transition:
      background-color 100ms ease-out,
      color 100ms ease-out;
  }

  .heading-option:hover {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-0);
  }

  /* ---- Markdown body (preview + comment rendering) ---- */
  :global(.markdown-body) {
    --md-code-bg: oklch(from var(--clr-base-0) calc(l - 0.03) c h);
  }

  :global(.markdown-body p) {
    margin: 0 0 0.6em;
  }
  :global(.markdown-body p:last-child) {
    margin-bottom: 0;
  }
  :global(.markdown-body strong) {
    font-weight: 700;
    color: var(--clr-text-0);
  }
  :global(.markdown-body em) {
    font-style: italic;
  }
  :global(.markdown-body del) {
    text-decoration: line-through;
    color: var(--clr-text-2);
  }
  :global(.markdown-body code) {
    font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 0.82em;
    padding: 0.1em 0.35em;
    border-radius: 4px;
    background-color: var(--md-code-bg);
    color: var(--clr-text-0);
  }
  :global(.markdown-body pre.comment-code-block) {
    font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 0.82rem;
    line-height: 1.6;

    padding: 0.75rem 1rem;
    margin: 0.6em 0;
    border-radius: 6px;

    background-color: var(--clr-base-0);
    color: var(--clr-text-1);

    overflow-x: auto;
    scrollbar-width: thin;
  }
  :global(.markdown-body pre.comment-code-block code) {
    background: none;
    padding: 0;
    font-size: inherit;
    border-radius: 0;
  }
  :global(.markdown-body a) {
    color: var(--clr-link);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :global(.markdown-body a:hover) {
    color: var(--clr-link-hover);
  }
  :global(.markdown-body blockquote) {
    margin: 0.5em 0;
    padding: 0.25em 0.75em;
    border-left: 3px solid var(--clr-surface-2);
    color: var(--clr-text-2);
    font-style: italic;
  }
  :global(.markdown-body ul),
  :global(.markdown-body ol) {
    padding-left: 1.4em;
    margin: 0.4em 0;
  }
  :global(.markdown-body li) {
    margin: 0.15em 0;
  }
  :global(.markdown-body h1),
  :global(.markdown-body h2),
  :global(.markdown-body h3),
  :global(.markdown-body h4) {
    font-weight: 700;
    line-height: 1.3;
    margin: 0.75em 0 0.3em;
    color: var(--clr-text-0);
  }
  :global(.markdown-body h1) { font-size: 1.2em; }
  :global(.markdown-body h2) { font-size: 1.1em; }
  :global(.markdown-body h3) { font-size: 1em; }
  :global(.markdown-body h4) { font-size: 0.95em; }
  :global(.markdown-body hr) {
    border: none;
    height: 1px;
    background-color: var(--clr-surface-1);
    margin: 0.75em 0;
  }
</style>
