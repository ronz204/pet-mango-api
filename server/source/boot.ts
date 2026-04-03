import { Elysia } from "elysia";
import { RoomsPlugin } from "@features/rooms/plugin";
import { UsersPlugin } from "@features/users/plugin";
import { HealthPlugin } from "@plugins/health.plugin";
import { ScalarPlugin } from "@plugins/scalar.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AuthPlugin } from "@features/identity/plugin";

const app = new Elysia({ prefix: "/api" })
  .use(ScalarPlugin)
  .use(HealthPlugin)
  .use(PrismaPlugin)
  .use(AuthPlugin)
  .use(RoomsPlugin)
  .use(UsersPlugin)
  .listen(process.env.PORT!);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
