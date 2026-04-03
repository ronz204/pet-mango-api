import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { RoomRepository } from "@repos/rooms/room.repo";

import { SendBody } from "./send/send.schema";
import { SendHandler } from "./send/send.handler";
import { SendResponse } from "./send/send.schema";

import { InviteesParams } from "./invitees/invitees.schema";
import { InviteesHandler } from "./invitees/invitees.handler";
import { InviteesResponse } from "./invitees/invitees.schema";

const prefix: string = "/invitations";
const name: string = "invitations.plugin";

export const InvitesPlugin = new Elysia({ name, prefix })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => {
    const repo = new RoomRepository(prisma);
    const sendH = new SendHandler(repo);
    const inviteesH = new InviteesHandler(repo);
    return { sendH, inviteesH };
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
  })

  .get("/:roomId", async ({ status, params, inviteesH }) => {
    const response = await inviteesH.handle({ params });
    return status(200, response);
  }, {
    isAuth: true,
    params: InviteesParams,
    response: {
      200: InviteesResponse
    },
  });