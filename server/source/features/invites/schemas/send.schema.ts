import { t, type Static } from "elysia";

export const SendInviteBody = t.Object({
  roomId: t.Number({ minimum: 1 }),
  inviteeId: t.Number({ minimum: 1 }),
});

export const SendInviteRequest = t.Object({
  body: SendInviteBody,
  user: t.Number(),
});

export const SendInviteResponse = t.Object({
  id: t.Number(),
  roomId: t.Number(),
  inviteeId: t.Number(),
  createdAt: t.Date(),
});

export type SendInviteRequest = Static<typeof SendInviteRequest>;
export type SendInviteResponse = Static<typeof SendInviteResponse>;
