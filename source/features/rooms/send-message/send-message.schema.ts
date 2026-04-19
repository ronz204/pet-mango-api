import { t, type Static } from "elysia";

export const SendMessageBody = t.Object({
  content: t.String({ minLength: 1, maxLength: 2000 }),
});

export const SendMessageParams = t.Object({
  roomId: t.Number({ minimum: 1 }),
});

export const SendMessageRequest = t.Object({
  body: SendMessageBody,
  params: SendMessageParams,
  userId: t.Number(),
});

export const SendMessageResponse = t.Object({
  id: t.Number(),
  content: t.String(),
  senderId: t.Number(),
  senderName: t.String(),
  timestamp: t.String(),
});

export type SendMessageRequest = Static<typeof SendMessageRequest>;
export type SendMessageResponse = Static<typeof SendMessageResponse>;
