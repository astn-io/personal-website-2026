<script lang="ts">
  import CommentThread from './CommentThread.svelte';
  import VoteButtons from './VoteButtons.svelte';
  import CommentForm from './CommentForm.svelte';

  export type CommentNode = {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    parent?: { id: string } | string | null;
    children: CommentNode[];
  };

  const MAX_DEPTH = 3;

  type Props = {
    comment: CommentNode;
    payloadUrl: string;
    postId: string;
    depth: number;
    onReply: () => void;
  };

  let { comment, payloadUrl, postId, depth, onReply }: Props = $props();

  let showReplyForm = $state(false);
  let showDeepReplies = $state(false);

  const atMaxDepth = $derived(depth >= MAX_DEPTH);

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function onReplySuccess() {
    showReplyForm = false;
    onReply();
  }
</script>

<div class="comment" data-depth={Math.min(depth, 6)}>
  <div class="comment-header">
    <span class="author">{comment.authorName}</span>
    <time class="date" datetime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
  </div>

  <p class="comment-content">{comment.content}</p>

  <div class="comment-footer">
    <VoteButtons
      commentId={comment.id}
      upvotes={comment.upvotes ?? 0}
      downvotes={comment.downvotes ?? 0}
      {payloadUrl}
    />
    <button
      class="reply-btn"
      onclick={() => (showReplyForm = !showReplyForm)}
      aria-expanded={showReplyForm}
    >
      <span class="ri-reply-line"></span>
      Reply
    </button>
  </div>

  {#if showReplyForm}
    <div class="reply-form-wrap">
      <CommentForm
        {payloadUrl}
        {postId}
        parentId={comment.id}
        compact={true}
        onSuccess={onReplySuccess}
        onCancel={() => (showReplyForm = false)}
      />
    </div>
  {/if}

  {#if comment.children.length > 0}
    <div class="children">
      {#if atMaxDepth && !showDeepReplies}
        <button
          class="show-more-btn"
          onclick={() => (showDeepReplies = true)}
        >
          <span class="ri-arrow-down-s-line"></span>
          Show {comment.children.length}
          {comment.children.length === 1 ? 'reply' : 'replies'}
        </button>
      {:else}
        {#each comment.children as child (child.id)}
          <CommentThread
            comment={child}
            {payloadUrl}
            {postId}
            depth={depth + 1}
            {onReply}
          />
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .comment {
    position: relative;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    background-color: var(--clr-surface-0);
  }

  /* Indent nested comments with a left border */
  .children {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    margin-top: 0.75rem;
    padding-left: 1rem;
    border-left: 2px solid var(--clr-surface-1);
  }

  .comment-header {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 0.4rem;
  }

  .author {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--clr-text-0);
  }

  .date {
    font-size: 0.75rem;
    color: var(--clr-text-2);
  }

  .comment-content {
    font-size: 0.925rem;
    line-height: 1.6;
    color: var(--clr-text-1);
    margin: 0 0 0.6rem;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .comment-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .reply-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    padding: 0.2rem 0.45rem;

    border: none;
    border-radius: 4px;

    background-color: transparent;
    color: var(--clr-text-2);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;

    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out;
  }

  .reply-btn:hover {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
  }

  .reply-btn span {
    font-size: 0.95rem;
  }

  .reply-form-wrap {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--clr-surface-1);
  }

  .show-more-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;

    padding: 0.3rem 0.6rem;

    border: 1.5px solid var(--clr-surface-1);
    border-radius: 6px;

    background-color: transparent;
    color: var(--clr-text-2);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;

    cursor: pointer;
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      border-color 150ms ease-out;
  }

  .show-more-btn:hover {
    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
    border-color: var(--clr-surface-2);
  }

  .show-more-btn span {
    font-size: 1rem;
  }
</style>
