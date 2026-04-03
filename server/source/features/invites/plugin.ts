import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { RoomRepository } from "@repos/rooms/room.repo";

import { SendBody } from "./send/send.schema";
import { SendHandler } from "./send/send.handler";
import { SendResponse } from "./send/send.schema";

const prefix: string = "/invitations";
const name: string = "invitations.plugin";

export const InvitesPlugin = new Elysia({ name, prefix })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => {
    const repo = new RoomRepository(prisma);
    const sendH = new SendHandler(repo);
    return { sendH };
  })

  .post("/send", async ({ status, body, userId, sendH }) => {
    const response = await sendH.handle({ body });
    return status(200, response);
  }, {
    isAuth: true,
    body: SendBody,
    response: {
      200: SendResponse
    },
  });