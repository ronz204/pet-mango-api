import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { SignInBody } from "../schemas/signin.schema";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SignInResponse } from "../schemas/signin.schema";
import { SignInHandler } from "../handlers/signin.handler";

const name: string = "signin.plugin";

export const SignInPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    signInH: new SignInHandler(prisma),
  }))

  .post("/signin", async ({ body, status, jwt, signInH }) => {
    const response = await signInH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: SignInBody,
    response: { 200: SignInResponse },
  });
