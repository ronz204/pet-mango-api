import type { IMessageDao } from "@dal/message/message.idao";
import type { SendMessageRequest } from "./send-message.schema";
import type { SendMessageResponse } from "./send-message.schema";
import type { IMessageCache } from "@cache/message/message.icache";

type Request = SendMessageRequest;
type Response = SendMessageResponse;

import { SendMessageMapper } from "./send-message.mapper";

export class SendMessageHandler {
  constructor(
    private dao: IMessageDao,
    private cache: IMessageCache) {};

  public async handle({ body, params, userId }: Request): Promise<Response> {
    const message = await this.dao.create({
      roomId: params.roomId,
      content: body.content,
      senderId: userId,
    });

    const mapped = SendMessageMapper.toResponse(message);
    await this.cache.pusher({ roomId: params.roomId, message: mapped });

    return mapped;
  };
};
