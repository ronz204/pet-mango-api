import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { UserRepository } from "@repos/users/user.repo";

import { SignInBody } from "./signin/signin.schema";
import { SignInHandler } from "./signin/signin.handler";
import { SignInResponse } from "./signin/signin.schema";

import { SignUpBody } from "./signup/signup.schema";
import { SignUpHandler } from "./signup/signup.handler";
import { SignUpResponse } from "./signup/signup.schema";

const prefix: string = "/auth";
const name: string = "auth.plugin";

export const IdentityPlugin = new Elysia({ name, prefix })
  .use(PrismaPlugin)
  .use(TokenPlugin)
  
  .derive(({ prisma }) => {
    const repo = new UserRepository(prisma);
    const signInH = new SignInHandler(repo);
    const signUpH = new SignUpHandler(repo);

    return { signInH, signUpH };
  })
  
  .post("/signin", async ({ status, body, jwt, signInH }) => {
    const response = await signInH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: SignInBody,
    response: {
      200: SignInResponse
    },
  })

  .post("/signup", async ({ status, body, jwt, signUpH }) => {
    const response = await signUpH.handle({ body });
    const token = await jwt.sign(response);
    return status(200, { token });
  }, {
    body: SignUpBody,
    response: {
      200: SignUpResponse
    },
  });
