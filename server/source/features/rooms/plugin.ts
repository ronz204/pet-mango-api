import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { RoomRepository } from "@repos/rooms/room.repo";

import { CreateBody } from "./create/create.schema";
import { CreateHandler } from "./create/create.handler";
import { CreateResponse } from "./create/create.schema";

const prefix: string = "/rooms";
const name: string = "rooms.plugin";

export const RoomsPlugin = new Elysia({ name, prefix })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => {
    const repo = new RoomRepository(prisma);
    const createH = new CreateHandler(repo);

    return { createH };
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
  });
