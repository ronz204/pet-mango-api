import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { SignUpBody } from "../schemas/signup.schema";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SignUpResponse } from "../schemas/signup.schema";
import { SignUpHandler } from "../handlers/signup.handler";

const name: string = "signup.plugin";

export const SignUpPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    signUpH: new SignUpHandler(prisma),
  }))

  .post("/signup", async ({ body, status, jwt, signUpH }) => {
    const response = await signUpH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: SignUpBody,
    response: { 200: SignUpResponse },
  });
