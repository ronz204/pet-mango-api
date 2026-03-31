import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { UpdateUserBody } from "../schemas/update.schema";
import { UpdateUserResponse } from "../schemas/update.schema";
import { UpdateUserHandler } from "../handlers/update.handler";

const name: string = "update.user.plugin";

export const UpdateUserPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    updateH: new UpdateUserHandler(prisma),
  }))

  .patch("/me", async ({ status, user, body, updateH }) => {
    const response = await updateH.handle({ body, user });
    return status(200, response);
  }, {
    auth: true,
    body: UpdateUserBody,
    response: {
      200: UpdateUserResponse,
    },
  });
