import { Elysia, type ElysiaConfig } from "elysia";
import { LoginPlugin } from "./plugins/login.plugin";

const config: ElysiaConfig<"/auth"> = {
  prefix: "/auth", name: "auth.plugin"
};

export const AuthPlugin = new Elysia(config)
  .use(LoginPlugin);
