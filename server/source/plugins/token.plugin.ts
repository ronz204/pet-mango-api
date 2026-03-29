import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";

export const TokenPlugin = new Elysia({ name: "token.plugin" })
  .use(jwt({
    name: "jwt", exp: "1h",
    secret: process.env.JWT_SECRET!,
  }));
