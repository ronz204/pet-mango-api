import { t, type Static } from "elysia";

export const SendBody = t.Object({
  roomId: t.Number({ minimum: 1 }),
  inviteeId: t.Number({ minimum: 1 }),
});

export const SendRequest = t.Object({
  body: SendBody,
});

export const SendResponse = t.Object({
  id: t.Number(),
  roomId: t.Number(),
  inviteeId: t.Number(),
});

export type SendRequest = Static<typeof SendRequest>;
export type SendResponse = Static<typeof SendResponse>;
