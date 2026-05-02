import { env } from "@env";
import { Elysia } from "elysia";
import { CorsPlugin } from "@plugins/cors.plugin";
import { HealthPlugin } from "@plugins/health.plugin";
import { ScalarPlugin } from "@plugins/scalar.plugin";

export const app = new Elysia({ prefix: "/api" })
  .use(CorsPlugin)
  .use(ScalarPlugin)
  .use(HealthPlugin)
  .listen(env.APP_PORT);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
