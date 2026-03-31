import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { CreateRoomBody } from "../schemas/create.schema";
import { CreateRoomResponse } from "../schemas/create.schema";
import { CreateRoomHandler } from "../handlers/create.handler";

const name: string = "create.room.plugin";

export const CreateRoomPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    createH: new CreateRoomHandler(prisma),
  }))

  .post("/new", async ({ body, status, user, createH }) => {
    const response = await createH.handle({ body, user });
    return status(200, response);
  }, {
    auth: true,
    body: CreateRoomBody,
    response: {
      200: CreateRoomResponse
    },
  }); 
