import { Elysia } from "elysia";
import { LoginBody } from "../schemas/login.schema";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { LoginResponse } from "../schemas/login.schema";
import { LoginHandler } from "../handlers/login.handler";

export const LoginPlugin = new Elysia({ name: "login.plugin" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    loginH: new LoginHandler(prisma),
  }))

  .post("/sign", async ({ body, status, jwt, loginH }) => {
    const response = await loginH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: LoginBody,
    response: { 200: LoginResponse },
  });
