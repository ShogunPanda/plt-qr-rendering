/// <reference path="../global.d.ts" />

import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  errorCodes,
} from "fastify";
import { randomUUID } from "node:crypto";
import type { Url } from "../../database/types/index.js";

export default async function (fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  server.get("/", async function () {
    throw new errorCodes.FST_ERR_NOT_FOUND();
  });

  server.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
          additionalProperties: false,
        },
      },
    },
    async function (request, reply) {
      const url = (await request.database.trackUrl({
        id: request.params.id,
      })) as unknown as Url;

      request.log.info({ response: url }, "TRACK");

      if ("statusCode" in url && url.statusCode !== 200) {
        const error = url as unknown as FastifyError;
        reply.status(error.statusCode!);
        return error;
      }

      reply.header("x-clicks", url.count);
      reply.redirect(301, url.url);
    }
  );

  server.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            url: {
              type: "string",
              format: "url",
            },
          },
          additionalProperties: false,
          required: ["url"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "url",
              },
            },
            additionalProperties: false,
            required: ["url"],
          },
          500: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              code: { type: "string" },
              error: { type: "string" },
              message: { type: "string" },
            },
            additionalProperties: false,
            required: ["statusCode", "code", "message"],
          },
        },
      },
    },
    async function (request, reply): Promise<Url | Required<FastifyError>> {
      const response = await request.database.createUrl({
        id: randomUUID(),
        url: request.body.url,
      });

      if ("statusCode" in response && response.statusCode !== 200) {
        const error = response as unknown as Required<FastifyError>;
        reply.status(error.statusCode);
        return error;
      }

      const url = new URL(
        `/urls/${response.id!}`,
        `http://${request.headers["x-forwarded-host"]}`
      );
      const url64 = Buffer.from(url.toString()).toString("base64url");
      const qr = new URL(
        `/qr/?data=${url64}`,
        `http://${request.headers["x-forwarded-host"]}`
      );

      return { url: qr.toString() };
    }
  );

  server.get(
    "/stats",
    async function (
      request: FastifyRequest,
      _reply: FastifyReply
    ): Promise<Url[]> {
      const urls = (await request.database.getUrls()) as Url[];

      return urls;
    }
  );
}
