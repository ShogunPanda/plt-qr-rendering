import { errorCodes } from 'fastify'
import { randomUUID } from 'node:crypto'

export default function (server) {
  server.get('/', async function () {
    throw new errorCodes.FST_ERR_NOT_FOUND()
  })

  server.get(
    '/:id',
    {
      schema: {
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
    async function (request, reply) {
      const response = await fetch(`http://database.plt.local/urls/${request.params.id}/track`, { method: 'PUT' })

      if (response.status !== 200) {
        const error = await response.text()
        reply.status(response.status)
        return error
      }

      const url = await response.json()
      reply.header('x-clicks', url.count)
      reply.redirect(url.url, 301)
    }
  )

  server.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'url'
            }
          },
          additionalProperties: false,
          required: ['url']
        },
        response: {
          200: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                format: 'url'
              }
            },
            additionalProperties: false,
            required: ['url']
          },
          500: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              code: { type: 'string' },
              error: { type: 'string' },
              message: { type: 'string' }
            },
            additionalProperties: false,
            required: ['statusCode', 'code', 'message']
          }
        }
      }
    },
    async function (request, reply) {
      const rootUrl = `http://${request.headers['x-forwarded-host']}`
      const response = await fetch('http://database.plt.local/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: randomUUID(),
          url: request.body.url
        })
      })

      if (response.status !== 200) {
        const error = await response.text()
        reply.status(response.status)
        return error
      }

      const { id } = await response.json()

      const url = new URL(`/urls/${id}`, rootUrl)
      const url64 = Buffer.from(url.toString()).toString('base64url')
      const qr = new URL(`/qr/${url64}`, rootUrl)

      return { url: qr.toString() }
    }
  )

  server.get('/stats', async function (reply) {
    const response = await fetch('http://database.plt.local/urls')

    if (response.status !== 200) {
      const error = await response.text()
      reply.status(response.status)
      return error
    }

    const urls = await response.json()
    return urls
  })
}
