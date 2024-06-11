/// <reference path="../global.d.ts" />

import sql from "@databases/sql";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance } from "fastify";
import { Url } from "../types";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<JsonSchemaToTsProvider>().put(
    "/:id/track",
    {
      schema: {
        operationId: "trackUrl",
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
    async function (request): Promise<Url> {
      const id = request.params.id!;

      await fastify.platformatic.db.query(
        sql`UPDATE urls SET count = count + 1 WHERE id = ${id}`
      );

      const matching = await fastify.platformatic.entities.url.find({
        where: { id: { eq: id } },
      });

      return matching[0] as Url;
    }
  );
}
