import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SendInviteBody } from "../schemas/send.schema";
import { SendInviteResponse } from "../schemas/send.schema";
import { SendInviteHandler } from "../handlers/send.handler";

const name: string = "send.invite.plugin";

export const SendInvitePlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    sendH: new SendInviteHandler(prisma),
  }))

  .post("/send", async ({ body, status, user, sendH }) => {
    const response = await sendH.handle({ body, user });
    return status(200, response);
  }, {
    auth: true,
    body: SendInviteBody,
    response: {
      200: SendInviteResponse,
    },
  });
