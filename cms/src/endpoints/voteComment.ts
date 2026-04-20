import type { PayloadRequest } from 'payload'

export async function voteCommentHandler(req: PayloadRequest): Promise<Response> {
  try {
    const body = await req.json?.()
    const { commentId, voterId, type } = body ?? {}

    if (!commentId || !voterId || !['up', 'down'].includes(type)) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const payload = req.payload

    const existingVotes = await payload.find({
      collection: 'votes',
      where: {
        and: [
          { comment: { equals: commentId } },
          { voterId: { equals: voterId } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    })

    const existingVote = existingVotes.docs[0]

    const comment = await payload.findByID({
      collection: 'comments',
      id: commentId,
      overrideAccess: true,
    })

    if (!comment) {
      return Response.json({ error: 'Comment not found' }, { status: 404 })
    }

    let upvotes = (comment.upvotes as number) ?? 0
    let downvotes = (comment.downvotes as number) ?? 0
    let userVote: 'up' | 'down' | null = null

    if (!existingVote) {
      await payload.create({
        collection: 'votes',
        data: { comment: commentId, voterId, type },
        overrideAccess: true,
      })
      if (type === 'up') upvotes++
      else downvotes++
      userVote = type
    } else if (existingVote.type === type) {
      await payload.delete({
        collection: 'votes',
        id: existingVote.id as string,
        overrideAccess: true,
      })
      if (type === 'up') upvotes = Math.max(0, upvotes - 1)
      else downvotes = Math.max(0, downvotes - 1)
      userVote = null
    } else {
      await payload.update({
        collection: 'votes',
        id: existingVote.id as string,
        data: { type },
        overrideAccess: true,
      })
      if (type === 'up') {
        upvotes++
        downvotes = Math.max(0, downvotes - 1)
      } else {
        downvotes++
        upvotes = Math.max(0, upvotes - 1)
      }
      userVote = type
    }

    await payload.update({
      collection: 'comments',
      id: commentId,
      data: { upvotes, downvotes },
      overrideAccess: true,
    })

    return Response.json({ upvotes, downvotes, userVote })
  } catch (err) {
    console.error('[voteComment]', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
