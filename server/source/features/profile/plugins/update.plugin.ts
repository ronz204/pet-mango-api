import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { UpdateProfileBody } from "../schemas/update.schema";
import { UpdateProfileResponse } from "../schemas/update.schema";
import { UpdateProfileHandler } from "../handlers/update.handler";

export const UpdatePlugin = new Elysia({ name: "update.profile" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    updateH: new UpdateProfileHandler(prisma),
  }))

  .put("/me", async ({ status, user, body, updateH }) => {
    const response = await updateH.handle({ body, user });
    return status(200, response);
  }, {
    auth: true,
    body: UpdateProfileBody,
    response: {
      200: UpdateProfileResponse,
    },
  });
