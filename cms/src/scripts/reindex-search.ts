import { loadEnv } from 'payload/node'

loadEnv()

const { getPayload } = await import('payload')
const { default: config } = await import('@payload-config')

const COLLECTIONS = ['posts', 'frontend-projects', 'graphic-design-projects'] as const

async function reindex() {
  const payload = await getPayload({ config })

  for (const collection of COLLECTIONS) {
    const { docs } = await payload.find({
      collection,
      limit: 1000,
      depth: 0,
      pagination: false,
      overrideAccess: true,
    })

    payload.logger.info(`Reindexing ${docs.length} ${collection}…`)

    for (const doc of docs) {
      await payload.update({
        collection,
        id: doc.id,
        data: {},
        overrideAccess: true,
      })
    }
  }

  payload.logger.info('Reindex complete.')
  process.exit(0)
}

reindex().catch((err) => {
  console.error(err)
  process.exit(1)
})
