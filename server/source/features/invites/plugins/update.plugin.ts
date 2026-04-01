import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { UpdateInviteParams } from "../schemas/update.schema";
import { UpdateInviteBody } from "../schemas/update.schema";
import { UpdateInviteResponse } from "../schemas/update.schema";
import { UpdateInviteHandler } from "../handlers/update.handler";

const name: string = "update.invite.plugin";

export const UpdateInvitePlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    updateH: new UpdateInviteHandler(prisma),
  }))

  .patch("/:id", async ({ params, body, status, user, updateH }) => {
    const response = await updateH.handle({ params, body, user });
    return status(200, response);
  }, {
    auth: true,
    params: UpdateInviteParams,
    body: UpdateInviteBody,
    response: {
      200: UpdateInviteResponse,
    },
  });
