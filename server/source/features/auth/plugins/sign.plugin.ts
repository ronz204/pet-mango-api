import { Elysia } from "elysia";
import { SignInBody } from "../schemas/sign.schema";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SignInResponse } from "../schemas/sign.schema";
import { SignInHandler } from "../handlers/sign.handler";

export const SignInPlugin = new Elysia({ name: "signin.plugin" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    signH: new SignInHandler(prisma),
  }))

  .post("/sign", async ({ body, status, jwt, signH }) => {
    const response = await signH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: SignInBody,
    response: { 200: SignInResponse },
  });
