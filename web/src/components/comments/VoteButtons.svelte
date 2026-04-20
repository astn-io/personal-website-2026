<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import {
    getVoterId,
    getStoredVotes,
    setStoredVote,
  } from '@scripts/comments/commentStorage';

  type Props = {
    commentId: string;
    upvotes: number;
    downvotes: number;
    payloadUrl: string;
  };

  let { commentId, upvotes: initialUpvotes, downvotes: initialDownvotes, payloadUrl }: Props =
    $props();

  let upvotes = $state(untrack(() => initialUpvotes));
  let downvotes = $state(untrack(() => initialDownvotes));
  let userVote = $state<'up' | 'down' | null>(null);
  let voting = $state(false);

  onMount(() => {
    const votes = getStoredVotes();
    userVote = votes[commentId] ?? null;
  });

  async function vote(type: 'up' | 'down') {
    if (voting) return;
    voting = true;

    const voterId = getVoterId();

    try {
      const res = await fetch(`${payloadUrl}/api/vote-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, voterId, type }),
      });

      if (!res.ok) throw new Error('Vote failed');

      const data = await res.json();
      upvotes = data.upvotes;
      downvotes = data.downvotes;
      userVote = data.userVote;
      setStoredVote(commentId, data.userVote);
    } catch {
      // silently fail — vote is best-effort
    } finally {
      voting = false;
    }
  }
</script>

<div class="vote-buttons">
  <button
    class="vote-btn upvote"
    class:active={userVote === 'up'}
    disabled={voting}
    onclick={() => vote('up')}
    aria-label="Upvote"
    aria-pressed={userVote === 'up'}
  >
    <span class="ri-arrow-up-s-line"></span>
    {#if upvotes > 0}<span class="vote-count">{upvotes}</span>{/if}
  </button>
  <button
    class="vote-btn downvote"
    class:active={userVote === 'down'}
    disabled={voting}
    onclick={() => vote('down')}
    aria-label="Downvote"
    aria-pressed={userVote === 'down'}
  >
    <span class="ri-arrow-down-s-line"></span>
    {#if downvotes > 0}<span class="vote-count">{downvotes}</span>{/if}
  </button>
</div>

<style>
  .vote-buttons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .vote-btn {
    display: flex;
    align-items: center;
    gap: 0.2rem;

    padding: 0.2rem 0.45rem;

    border: 1.5px solid transparent;
    border-radius: 4px;

    background-color: transparent;
    color: var(--clr-text-2);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1;

    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      border-color 150ms ease-out;
  }

  .vote-btn span:first-child {
    font-size: 1.05rem;
  }

  .vote-btn:hover:not(:disabled) {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
  }

  .vote-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .vote-btn.upvote.active {
    background-color: oklch(from var(--clr-green) l c h / 0.15);
    border-color: oklch(from var(--clr-green) l c h / 0.4);
    color: var(--clr-green);
  }

  .vote-btn.downvote.active {
    background-color: oklch(from var(--clr-red) l c h / 0.15);
    border-color: oklch(from var(--clr-red) l c h / 0.4);
    color: var(--clr-red);
  }
</style>
