import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/users"> = {
  prefix: "/users", name: "users.plugin"
};

export const UsersPlugin = new Elysia(config);
