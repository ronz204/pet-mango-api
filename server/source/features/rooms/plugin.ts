import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { RoomRepository } from "@repos/rooms/room.repo";

import { LeaveParams } from "./leave/leave.schema";
import { LeaveHandler } from "./leave/leave.handler";
import { LeaveResponse } from "./leave/leave.schema";

import { CreateBody } from "./create/create.schema";
import { CreateHandler } from "./create/create.handler";
import { CreateResponse } from "./create/create.schema";

import { DetailsParams } from "./details/details.schema";
import { DetailsHandler } from "./details/details.handler";
import { DetailsResponse } from "./details/details.schema";

const prefix: string = "/rooms";
const name: string = "rooms.plugin";

export const RoomsPlugin = new Elysia({ name, prefix })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => {
    const repo = new RoomRepository(prisma);
    const leaveH = new LeaveHandler(repo);
    const createH = new CreateHandler(repo);
    const detailsH = new DetailsHandler(repo);

    return { createH, detailsH, leaveH };
  })


  .post("/new", async ({ status, body, userId, createH }) => {
    const response = await createH.handle({ userId, body });
    return status(200, response);
  }, {
    isAuth: true,
    body: CreateBody,
    response: {
      200: CreateResponse
    },
  })
  
  .get("/:roomId", async ({ status, params, detailsH }) => {
    const response = await detailsH.handle({ params });
    return status(200, response);
  }, {
    isAuth: true,
    params: DetailsParams,
    response: {
      200: DetailsResponse
    },
  })
  
  .post("/:roomId/leave", async ({ status, params, userId, leaveH }) => {
    const response = await leaveH.handle({ params, userId });
    return status(200, response);
  }, {
    isAuth: true,
    params: LeaveParams,
    response: {
      200: LeaveResponse
    },
  });
