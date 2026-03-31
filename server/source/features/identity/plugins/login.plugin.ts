import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { LoginUserBody } from "../schemas/login.schema";
import { LoginUserResponse } from "../schemas/login.schema";
import { LoginUserHandler } from "../handlers/login.handler";

const name: string = "login.user.plugin";

export const LoginUserPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    loginH: new LoginUserHandler(prisma),
  }))

  .post("/login", async ({ body, status, jwt, loginH }) => {
    const response = await loginH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: LoginUserBody,
    response: { 200: LoginUserResponse },
  });
