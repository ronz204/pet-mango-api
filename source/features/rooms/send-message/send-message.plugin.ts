import { Elysia } from "elysia";
import { AuthPlugin } from "@auth/auth.plugin";
import { RedisPlugin } from "@database/redis.plugin";
import { MessageDao } from "@dal/message/message.dao";
import { PrismaPlugin } from "@database/prisma.plugin";
import { MessageCache } from "@cache/message/message.cache";

import { SendMessageBody } from "./send-message.schema";
import { SendMessageParams } from "./send-message.schema";
import { SendMessageHandler } from "./send-message.handler";
import { SendMessageResponse } from "./send-message.schema";

const name: string = "send-message.plugin";

export const SendMessagePlugin = new Elysia({ name })
  .use(AuthPlugin)
  .use(RedisPlugin)
  .use(PrismaPlugin)

  .derive(({ prisma, redis }) => {
    const dao = new MessageDao(prisma);
    const cache = new MessageCache(redis);
    const handler = new SendMessageHandler(dao, cache);

    return { handler };
  })

  .post("/:roomId/messages", async ({ status, body, params, userId, handler }) => {
    const response = await handler.handle({ userId, body, params });
    return status(201, response);
  }, {
    isAuth: true,
    body: SendMessageBody,
    params: SendMessageParams,
    response: {
      201: SendMessageResponse,
    },
  });
