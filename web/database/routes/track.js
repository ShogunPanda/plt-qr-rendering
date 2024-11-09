import sql from '@databases/sql'

export default async function (app) {
  app.put(
    '/urls/:id/track',
    {
      schema: {
        operationId: 'trackUrl',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' }
          },
          required: ['id'],
          additionalProperties: false
        }
      }
    },
    async function (request) {
      const id = request.params.id

      await app.platformatic.db.query(sql`UPDATE urls SET count = count + 1 WHERE id = ${id}`)

      const matching = await app.platformatic.entities.url.find({
        where: { id: { eq: id } }
      })

      return matching[0]
    }
  )
}
