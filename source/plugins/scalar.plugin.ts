import { env } from "@env";
import { Elysia } from "elysia";
import openapi from "@elysiajs/openapi";

export const ScalarPlugin = new Elysia({ name: "scalar.plugin" })
  .use(openapi({
    path: "/docs",
    documentation: {
      info: {
        title: env.APP_NAME,
        version: env.APP_VERSION,
      },
    },
  }));
