import { Elysia } from "elysia";
import { AuthPlugin } from "@features/auth/plugin";
import { UsersPlugin } from "@features/users/plugin";
import { HealthPlugin } from "@plugins/health.plugin";

const app = new Elysia({ prefix: "/api" })
  .use(HealthPlugin)
  .use(AuthPlugin)
  .use(UsersPlugin)
  .listen(process.env.PORT!);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
