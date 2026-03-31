import { Elysia, type ElysiaConfig } from "elysia";
import { UpdateUserPlugin } from "./plugins/update.plugin";
import { SearchUsersPlugin } from "./plugins/search.plugin";
import { ProfileUserPlugin } from "./plugins/profile.plugin";

const config: ElysiaConfig<"/users"> = {
  prefix: "/users", name: "users.plugin"
};

export const UsersPlugin = new Elysia(config)
  .use(UpdateUserPlugin)
  .use(SearchUsersPlugin)
  .use(ProfileUserPlugin);
