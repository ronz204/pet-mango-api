import { Elysia } from "elysia";
import { UserDao } from "@dal/users/user.dao";
import { AuthPlugin } from "@auth/auth.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

import { UpdateBasicInfoBody } from "./update-basic-info.schema";
import { UpdateBasicInfoHandler } from "./update-basic-info.handler";
import { UpdateBasicInfoResponse } from "./update-basic-info.schema";

const name: string = "update-basic-info.plugin";

export const UpdateBasicInfoPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AuthPlugin)

  .derive(({ prisma }) => {
    const dao = new UserDao(prisma);
    const handler = new UpdateBasicInfoHandler(dao);

    return { handler };
  })

  .patch("/", async ({ status, body, userId, handler }) => {
    const response = await handler.handle({ userId, body });
    return status(200, response);
  }, {
    isAuth: true,
    body: UpdateBasicInfoBody,
    response: {
      200: UpdateBasicInfoResponse,
    },
  });
