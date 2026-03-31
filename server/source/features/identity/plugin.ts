import { Elysia, type ElysiaConfig } from "elysia";
import { LoginUserPlugin } from "./plugins/login.plugin";
import { RegisterUserPlugin } from "./plugins/register.plugin";

const config: ElysiaConfig<"/auth"> = {
  prefix: "/auth", name: "auth.plugin"
};

export const AuthPlugin = new Elysia(config)
  .use(LoginUserPlugin)
  .use(RegisterUserPlugin);
