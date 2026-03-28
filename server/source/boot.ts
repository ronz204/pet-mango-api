import { Elysia } from "elysia";
import { HealthPlugin } from "@plugins/health.plugin";
import { UsersPlugin } from "@features/users/plugin";

const app = new Elysia({ prefix: "/api" })
  .use(HealthPlugin)
  .use(UsersPlugin)
  .listen(process.env.PORT!);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
