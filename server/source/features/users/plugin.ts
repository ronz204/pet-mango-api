import { Elysia } from "elysia";
import { UpdateUserPlugin } from "./plugins/update.plugin";
import { ProfileUserPlugin } from "./plugins/profile.plugin";

const prefix: string = "/users";
const name: string = "users.plugin";

export const UsersPlugin = new Elysia({ name, prefix })
  .use(UpdateUserPlugin)
  .use(ProfileUserPlugin);
