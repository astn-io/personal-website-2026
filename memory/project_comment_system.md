---
name: Comment System Architecture
description: How the blog comment system is implemented across CMS and frontend
type: project
---

Comment system added to blog posts on the `payload-cms-integration` branch.

**CMS (Payload):**
- `cms/src/collections/Comments.ts` — post relationship, optional parent (self-ref for threading), authorName, authorEmail, content, status (pending/approved/rejected), upvotes, downvotes. Public create access; read filtered to approved-only for unauthenticated; field-level access blocks public from setting status/vote counts.
- `cms/src/collections/Votes.ts` — comment relationship, voterId (localStorage UUID), type (up/down). Public create.
- `cms/src/endpoints/voteComment.ts` — custom Payload endpoint handler at `POST /api/vote-comment`. Checks for existing vote by voterId+commentId, creates/toggles/switches vote, updates comment counters atomically.
- Registered in `payload.config.ts` under `collections` and `endpoints`.

**Frontend (web/):**
- `web/src/scripts/comments/commentStorage.ts` — localStorage utilities: stored name (auto-generated adjective+animal), voterId (UUID), per-comment vote state.
- `web/src/components/comments/CommentSection.svelte` — fetches approved comments for a postId via Payload REST, builds flat→tree, renders form + threads.
- `web/src/components/comments/CommentThread.svelte` — recursive via `<svelte:self>`, collapses at depth 3 with "Show N replies" button.
- `web/src/components/comments/CommentForm.svelte` — optional name/email (compact mode for replies skips these), submits to `/api/comments`.
- `web/src/components/comments/VoteButtons.svelte` — calls vote endpoint, syncs to localStorage.

**Blog integration:**
- `payloadId: post.id` added to loader (`payloadPostsLoader.ts`) and content schema (`content.config.ts`) to pass Payload doc ID to CommentSection.
- `PostLayout.astro` has a `<slot name="after" />` below `<article>`.
- `blog/[id].astro` renders `<CommentSection slot="after" client:load postId={post.data.payloadId} />`.

**Why:** Comments require approval before appearing, so dynamic client-side fetch (not prerendered). Vote deduplication uses localStorage (intentionally not strict — personal blog).

**How to apply:** When extending comments (e.g. pagination, email notifications on approval), update the Comments collection and relevant Svelte components. Run `pnpm payload generate:types` after any schema changes.
