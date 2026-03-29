import { Elysia, type ElysiaConfig } from "elysia";
import { SignInPlugin } from "./plugins/sign.plugin";

const config: ElysiaConfig<"/auth"> = {
  prefix: "/auth", name: "auth.plugin"
};

export const AuthPlugin = new Elysia(config)
  .use(SignInPlugin);