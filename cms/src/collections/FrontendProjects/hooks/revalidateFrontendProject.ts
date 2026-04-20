import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateFrontendProject: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/frontend-projects/${doc.slug}`

      payload.logger.info(`Revalidating frontend project at path: ${path}`)

      revalidatePath(path)
      revalidateTag('frontend-projects-sitemap', 'max')
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/frontend-projects/${previousDoc.slug}`

      payload.logger.info(`Revalidating old frontend project at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('frontend-projects-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateFrontendProjectDelete: CollectionAfterDeleteHook = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/frontend-projects/${doc?.slug}`
    revalidatePath(path)
    revalidateTag('frontend-projects-sitemap', 'max')
  }
  return doc
}
