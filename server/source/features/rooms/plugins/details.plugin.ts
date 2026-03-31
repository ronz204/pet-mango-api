import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { DetailsRoomParams } from "../schemas/details.schema";
import { DetailsRoomResponse } from "../schemas/details.schema";
import { DetailsRoomHandler } from "../handlers/details.handler";

const name: string = "detail.room.plugin";

export const DetailsRoomPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    detailH: new DetailsRoomHandler(prisma),
  }))

  .get("/:id", async ({ params, status, user, detailH }) => {
    const response = await detailH.handle({ params, user });
    return status(200, response);
  }, {
    auth: true,
    params: DetailsRoomParams,
    response: {
      200: DetailsRoomResponse
    },
  });
