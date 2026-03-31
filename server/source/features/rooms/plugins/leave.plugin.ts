import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { LeaveRoomParams } from "../schemas/leave.schema";
import { LeaveRoomResponse } from "../schemas/leave.schema";
import { LeaveRoomHandler } from "../handlers/leave.handler";

const name: string = "leave.room.plugin";

export const LeaveRoomPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    leaveH: new LeaveRoomHandler(prisma),
  }))

  .delete("/:roomId/leave", async ({ params, user, leaveH }) => {
    const response = await leaveH.handle({ params, user });
    return response;
  }, {
    auth: true,
    params: LeaveRoomParams,
    response: {
      200: LeaveRoomResponse
    },
  }); 
