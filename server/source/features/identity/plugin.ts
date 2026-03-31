import { Elysia } from "elysia";
import { SignInPlugin } from "./plugins/signin.plugin";
import { SignUpPlugin } from "./plugins/signup.plugin";

const prefix: string = "/auth";
const name: string = "auth.plugin";

export const AuthPlugin = new Elysia({ name, prefix })
  .use(SignInPlugin)
  .use(SignUpPlugin);
