/// <reference path="../global.d.ts" />

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    async function (request: FastifyRequest, reply: FastifyReply) {
      reply.type("text/html");

      return readFile(
        resolve(__dirname, "../../assets/frontend.html"),
        "utf-8"
      );
    }
  );
}
