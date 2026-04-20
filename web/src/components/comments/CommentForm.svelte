<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getStoredName,
    setStoredName,
  } from '@scripts/comments/commentStorage';

  type FormState = 'idle' | 'submitting' | 'success' | 'error';

  type Props = {
    payloadUrl: string;
    postId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    compact?: boolean;
  };

  let {
    payloadUrl,
    postId,
    parentId,
    onSuccess,
    onCancel,
    compact = false,
  }: Props = $props();

  let name = $state('');
  let email = $state('');
  let content = $state('');
  let formState = $state<FormState>('idle');
  let errorMessage = $state('');
  let generatedName = $state('');

  onMount(() => {
    generatedName = getStoredName();
  });

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (formState === 'submitting') return;

    formState = 'submitting';
    errorMessage = '';

    const authorName = name.trim() || generatedName;
    if (name.trim()) setStoredName(name.trim());

    try {
      const body: Record<string, unknown> = {
        post: postId,
        authorName,
        content: content.trim(),
      };
      if (email.trim()) body.authorEmail = email.trim();
      if (parentId) body.parent = parentId;

      const res = await fetch(`${payloadUrl}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to submit');

      formState = 'success';
      content = '';
      name = '';
      email = '';

      setTimeout(() => {
        formState = 'idle';
        onSuccess?.();
      }, 2000);
    } catch {
      errorMessage = 'Failed to post comment. Please try again.';
      formState = 'error';
    }
  }
</script>

<form class="comment-form" class:compact onsubmit={onSubmit}>
  {#if formState === 'success'}
    <div class="success-state" role="status">
      <span class="ri-checkbox-circle-line success-icon"></span>
      <div>
        <p class="success-title">Comment submitted!</p>
        <p class="success-body">It will appear after approval.</p>
      </div>
    </div>
  {:else}
    {#if !compact}
      <div class="form-row two-col">
        <div class="field">
          <label for="comment-name"
            >Name <span class="optional">(optional)</span></label
          >
          <input
            id="comment-name"
            type="text"
            placeholder={generatedName || 'Anonymous'}
            bind:value={name}
            disabled={formState === 'submitting'}
          />
          {#if !name && generatedName}
            <small>Posting as <strong>{generatedName}</strong></small>
          {/if}
        </div>
        <div class="field">
          <label for="comment-email"
            >Email <span class="optional">(optional)</span></label
          >
          <input
            id="comment-email"
            type="email"
            placeholder="you@example.com"
            bind:value={email}
            disabled={formState === 'submitting'}
          />
        </div>
      </div>
    {/if}

    <div class="field">
      <label for={compact ? 'reply-content' : 'comment-content'}>
        {compact ? 'Reply' : 'Comment'}
      </label>
      <textarea
        id={compact ? 'reply-content' : 'comment-content'}
        rows={compact ? 2 : 4}
        placeholder={compact ? 'Write a reply…' : 'Share your thoughts…'}
        bind:value={content}
        disabled={formState === 'submitting'}
        required
      ></textarea>
    </div>

    {#if formState === 'error'}
      <p class="error-message" role="alert">
        <span class="ri-error-warning-line"></span>
        {errorMessage}
      </p>
    {/if}

    <div class="form-actions">
      {#if onCancel}
        <button
          type="button"
          class="btn-cancel"
          onclick={onCancel}
          disabled={formState === 'submitting'}
        >
          Cancel
        </button>
      {/if}
      <button
        type="submit"
        class="btn-submit"
        disabled={formState === 'submitting' || !content.trim()}
      >
        {#if formState === 'submitting'}
          Posting…
          <span class="ri-loader-4-line spin"></span>
        {:else}
          {compact ? 'Reply' : 'Post Comment'}
          <span class="ri-send-plane-2-line"></span>
        {/if}
      </button>
    </div>
  {/if}
</form>

<style>
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comment-form.compact {
    gap: 0.6rem;
  }

  .form-row.two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  @media (max-width: 540px) {
    .form-row.two-col {
      grid-template-columns: 1fr;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field label {
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02rem;
    color: var(--clr-text-1);
  }

  .field label .optional {
    font-weight: 400;
    color: var(--clr-text-2);
  }

  .field small {
    font-size: 0.75rem;
    color: var(--clr-text-2);
  }

  .field small strong {
    color: var(--clr-text-1);
  }

  .field input,
  .field textarea {
    font-family: inherit;
    font-size: 0.9rem;

    padding: 0.5rem 0.7rem;

    border: 1.5px solid var(--clr-surface-1);
    border-radius: 6px;

    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);

    outline: none;
    transition:
      border-color 150ms ease-out,
      box-shadow 150ms ease-out;
  }

  .field input::placeholder,
  .field textarea::placeholder {
    color: var(--clr-text-2);
    opacity: 0.6;
  }

  .field input:focus,
  .field textarea:focus {
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 3px oklch(from var(--clr-primary) l c h / 0.12);
  }

  .field input:disabled,
  .field textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .field textarea {
    resize: vertical;
    min-height: 4rem;
  }

  .compact .field textarea {
    min-height: 3rem;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--clr-red);
    margin: 0;
  }

  .form-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.6rem;
  }

  .btn-cancel,
  .btn-submit {
    display: flex;
    align-items: center;
    gap: 0.35rem;

    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;

    padding: 0.5rem 1rem;

    border: none;
    border-radius: 6px;

    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      outline-color 150ms ease-out;
  }

  .btn-cancel {
    background-color: transparent;
    color: var(--clr-text-1);
    outline: 1.5px solid var(--clr-surface-1);
  }

  .btn-cancel:hover:not(:disabled) {
    background-color: var(--clr-surface-0);
    color: var(--clr-text-0);
    outline-color: var(--clr-surface-2);
  }

  .btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-submit {
    background-color: var(--clr-primary);
    color: var(--clr-base-0);
    outline: 2px solid transparent;
  }

  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-submit:hover:not(:disabled) {
    background-color: oklch(from var(--clr-primary) calc(l + 0.05) c h);
  }

  :global(:root[data-color-scheme='dark']) .btn-submit {
    background-color: oklch(from var(--clr-primary) calc(l - 0.08) c h);
    color: var(--clr-text-0);
  }

  :global(:root[data-color-scheme='dark']) .btn-submit:hover:not(:disabled) {
    background-color: var(--clr-primary);
  }

  .btn-submit span {
    font-size: 1rem;
  }

  .success-state {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    padding: 0.875rem 1rem;

    background-color: oklch(from var(--clr-green) l c h / 0.12);
    border: 1px solid oklch(from var(--clr-green) l c h / 0.3);
    border-radius: 8px;
  }

  .success-icon {
    font-size: 1.5rem;
    color: var(--clr-green);
    flex-shrink: 0;
  }

  .success-title {
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 0.1rem;
  }

  .success-body {
    font-size: 0.8rem;
    color: var(--clr-text-1);
    margin: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    display: inline-block;
    animation: spin 0.7s linear infinite;
  }
</style>
