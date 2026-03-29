import { Elysia, type ElysiaConfig } from "elysia";
import { ProfilePlugin } from "./plugins/profile.plugin";

const config: ElysiaConfig<"/users"> = {
  prefix: "/users", name: "users.plugin"
};

export const UsersPlugin = new Elysia(config)
  .use(ProfilePlugin);
