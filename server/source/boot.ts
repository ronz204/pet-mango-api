import { Elysia } from "elysia";
import { AuthPlugin } from "@features/auth/plugin";
import { UsersPlugin } from "@features/users/plugin";
import { RoomsPlugin } from "@features/rooms/plugin";
import { HealthPlugin } from "@plugins/health.plugin";
import { ProfilePlugin } from "@features/profile/plugin";

const app = new Elysia({ prefix: "/api" })
  .use(HealthPlugin)
  .use(AuthPlugin)
  .use(UsersPlugin)
  .use(RoomsPlugin)
  .use(ProfilePlugin)
  .listen(process.env.PORT!);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
