---
title: 'Git Workflows That Actually Work'
description: 'The branching strategy, commit discipline, and rebase habits that have made my solo and team projects much less painful to maintain.'
pubDate: 2026-03-05
---

# Git Workflows That Actually Work

Git is one of those tools where the difference between using it and using it well is enormous. Here's what I've settled on after years of trial and error.

## Commit Messages

The standard format for a reason:

```
Short summary (50 chars max)

Optional longer explanation. Wrap at 72 characters. Explain the
*why*, not the *what* — the diff shows the what.

Refs: #123
```

I've started writing commit messages as if I'm explaining to a future coworker who has no context. That future coworker is usually me, six months later.

## Branching

For solo projects: just `main`. Short-lived feature branches if something is experimental, merged and deleted when done.

For teams: trunk-based development wins over long-lived feature branches almost every time. Shorter-lived branches mean fewer merge conflicts and faster integration.

```bash
git switch -c feat/add-search
# ... work ...
git switch main
git merge --no-ff feat/add-search
git branch -d feat/add-search
```

The `--no-ff` keeps a merge commit even when fast-forward is possible. This preserves the branch topology in `git log --graph`, which is genuinely useful history.

## Interactive Rebase Before Merging

Clean up messy work-in-progress commits before they hit `main`:

```bash
git rebase -i main
```

I'll squash checkpoint commits, fix up typos, and reword messages that made sense at 2am but don't in the morning. The goal: a commit history that tells a coherent story.

## Aliases I Use Daily

```bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate"
git config --global alias.recent "branch --sort=-committerdate"
```

`git lg` is the one I'd keep if I could only keep one. The graph view is invaluable for understanding what's going on.

## The One Rule

Never rewrite history that's been pushed to a shared remote. Everything else is negotiable.
