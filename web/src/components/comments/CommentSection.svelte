<script lang="ts">
  import { onMount } from 'svelte';
  import CommentThread, { type CommentNode } from './CommentThread.svelte';
  import CommentForm from './CommentForm.svelte';

  type Props = {
    payloadUrl: string;
    postId: string;
    postCollection: string;
  };

  const { payloadUrl, postId, postCollection }: Props = $props();

  let comments = $state<CommentNode[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let totalCount = $state(0);

  const emptyMessages = [
    'Make the first move.',
    'Be the first to write something.',
    'The floor is yours.',
    "No one's talked yet — start the conversation.",
    'Silence is golden, but comments are better.',
    'Someone has to go first. Why not you?',
    'The comment section is a blank canvas.',
    'Your thoughts could live here.',
    'First comment? Legendary.',
    'Nothing yet. Be the pioneer.',
    "Drop the first comment. You'll be famous.",
    "It's quiet in here. Too quiet.",
    'Break the silence.',
    'The comment section awaits its first visitor.',
    'Write something. Anything. We dare you.',
  ];

  const emptyMessage =
    emptyMessages[Math.floor(Math.random() * emptyMessages.length)];

  type RawComment = {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
    upvotes: number;
    downvotes: number;
    parent?: { id: string } | string | null;
  };

  function buildTree(flat: RawComment[]): CommentNode[] {
    const map = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];

    for (const c of flat) {
      map.set(c.id, { ...c, children: [] });
    }

    for (const node of map.values()) {
      const parentId =
        node.parent && typeof node.parent === 'object'
          ? node.parent.id
          : (node.parent as string);

      if (parentId && map.has(parentId)) {
        map.get(parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async function fetchComments() {
    loading = true;
    error = null;

    try {
      const url = new URL(`${payloadUrl}/api/comments`);
      url.searchParams.set('where[post.value][equals]', postId);
      url.searchParams.set('where[status][equals]', 'approved');
      url.searchParams.set('depth', '1');
      url.searchParams.set('limit', '500');
      url.searchParams.set('sort', 'createdAt');

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      totalCount = data.totalDocs ?? data.docs?.length ?? 0;
      comments = buildTree(data.docs ?? []);
    } catch {
      error = 'Could not load comments.';
    } finally {
      loading = false;
    }
  }

  onMount(fetchComments);
</script>

<section class="comment-section">
  <div class="section-header">
    <h2 class="section-title">
      <span class="ri-chat-3-line"></span>
      <span>Comments</span>
      {#if totalCount > 0}
        <span class="count-badge">{totalCount}</span>
      {/if}
    </h2>
  </div>

  <div class="threads-container">
    {#if loading}
      <div class="loading-state">
        <span class="ri-loader-4-line spin"></span>
        Loading comments…
      </div>
    {:else if error}
      <p class="error-state">
        <span class="ri-error-warning-line"></span>
        {error}
      </p>
    {:else if comments.length === 0}
      <p class="empty-state">{emptyMessage}</p>
    {:else}
      {#each comments as comment (comment.id)}
        <CommentThread
          {comment}
          {payloadUrl}
          {postId}
          {postCollection}
          depth={0}
          onReply={fetchComments}
        />
      {/each}
    {/if}
  </div>

  <div class="new-comment-block">
    <h3 class="new-comment-label section-title">
      <span class="ri-pencil-line"></span>
      <span>Write a Comment</span>
    </h3>
    <CommentForm
      {payloadUrl}
      {postId}
      {postCollection}
      onSuccess={fetchComments}
    />
  </div>
</section>

<style>
  .comment-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--clr-surface-1);
  }

  .comments-section-hr {
    margin-bottom: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.5ch;
    margin-bottom: 1.5rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    font-size: 1.4rem;
    font-weight: 700;
    margin: 0;
    color: var(--clr-text-0);
  }

  .section-title span:first-child {
    font-size: 1.3rem;
    color: var(--clr-text-2);
  }

  .count-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.4rem;

    background-color: var(--clr-surface-1);
    color: var(--clr-text-1);
    font-size: 0.75rem;
    font-weight: 700;

    border-radius: 999px;
  }

  .new-comment-block {
    margin-top: 2rem;
  }

  .new-comment-label {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--clr-text-1);
    margin: 0 0 1rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .threads-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    padding: 1.5rem;
    font-size: 0.9rem;
    color: var(--clr-text-2);
  }

  .error-state {
    color: var(--clr-red);
  }

  .empty-state {
    justify-content: center;
    font-style: italic;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    display: inline-block;
    animation: spin 0.7s linear infinite;
    font-size: 1.1rem;
  }
</style>
