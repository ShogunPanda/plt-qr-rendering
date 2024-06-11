/// <reference path="../global.d.ts" />

import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { FastifyInstance } from "fastify";
import QRCodeGenerator from "qrcode-generator";
import {
  drawAlignment,
  drawCircle,
  drawFinder,
  getAlignments,
  isAlignment,
  isFinder,
  padding,
  unit,
} from "../utils/rendering";

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<JsonSchemaToTsProvider>().get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            data: { type: "string" },
          },
          required: ["data"],
          additionalProperties: false,
        },
      },
    },
    async function (request, reply): Promise<string> {
      const qr = QRCodeGenerator(0, "H");
      qr.addData(
        Buffer.from(request.query.data, "base64url").toString("utf-8")
      );
      console.log(
        Buffer.from(request.query.data, "base64url").toString("utf-8")
      );
      qr.make();

      const modules = qr.getModuleCount();
      const aligments = getAlignments(modules);
      const dimension = modules * unit + padding;
      let svgPath = "";
      let svgPoints = "";

      // Draw regular modules
      for (let x = 0; x < modules; x++) {
        for (let y = 0; y < modules; y++) {
          if (
            !qr.isDark(y, x) ||
            isFinder(modules, y, x) ||
            isAlignment(aligments, y, x)
          ) {
            continue;
          }

          svgPoints += drawCircle(x, y);
        }
      }
      svgPath += `<path d="${svgPoints}" fill="currentColor" stroke="none" />`;

      // Draw the finders
      svgPath += drawFinder(0, 0);
      svgPath += drawFinder(modules - 7, 0);
      svgPath += drawFinder(0, modules - 7);

      // Draw the aligments
      for (const aligment of aligments) {
        svgPath += drawAlignment(aligment[0], aligment[1]);
      }

      reply.type("image/svg+xml");
      return `
        <svg 
          xmlns="http://www.w3.org/2000/svg" version="1.1" 
          width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}"
        >
          ${svgPath}
        </svg>
      `;
    }
  );
}
