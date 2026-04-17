import { Elysia } from "elysia";
import { CorsPlugin } from "@plugins/cors.plugin";
import { ScalarPlugin } from "@plugins/scalar.plugin";

export const app = new Elysia({ prefix: "/api" })
  .use(CorsPlugin)
  .use(ScalarPlugin)
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
