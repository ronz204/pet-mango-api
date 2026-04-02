import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { UsersPlugin } from "@features/users/plugin";
import { HealthPlugin } from "@plugins/health.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

const app = new Elysia({ prefix: "/api" })
  .use(openapi())
  .use(HealthPlugin)
  .use(PrismaPlugin)
  .use(UsersPlugin)
  .listen(process.env.PORT!);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
