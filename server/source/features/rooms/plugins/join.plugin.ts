import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { JoinRoomParams } from "../schemas/join.schema";
import { JoinRoomResponse } from "../schemas/join.schema";
import { JoinRoomHandler } from "../handlers/join.handler";

const name: string = "join.room.plugin";

export const JoinRoomPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    joinH: new JoinRoomHandler(prisma),
  }))

  .post("/:roomId/join", async ({ params, user, joinH }) => {
    const response = await joinH.handle({ params, user });
    return response;
  }, {
    auth: true,
    params: JoinRoomParams,
    response: {
      200: JoinRoomResponse
    },
  }); 
