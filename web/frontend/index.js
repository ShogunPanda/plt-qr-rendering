import fastifyStatic from '@fastify/static'
import fastify from 'fastify'
import { fileURLToPath } from 'node:url'

export async function create() {
  const server = fastify({ logger: true })
  await server.register(fastifyStatic, { root: fileURLToPath(new URL('./public', import.meta.url)) })

  return server
}
