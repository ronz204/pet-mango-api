import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { RegisterBody } from "../schemas/register.schema";
import { RegisterResponse } from "../schemas/register.schema";
import { RegisterHandler } from "../handlers/register.handler";

export const RegisterPlugin = new Elysia({ name: "register.plugin" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    registerH: new RegisterHandler(prisma),
  }))

  .post("/register", async ({ body, status, jwt, registerH }) => {
    const response = await registerH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: RegisterBody,
    response: { 200: RegisterResponse },
  });
