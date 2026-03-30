import { Elysia, type ElysiaConfig } from "elysia";
import { SearchUsersPlugin } from "./plugins/search.plugin";

const config: ElysiaConfig<"/users"> = {
  prefix: "/users", name: "users.plugin"
};

export const UsersPlugin = new Elysia(config)
  .use(SearchUsersPlugin);
