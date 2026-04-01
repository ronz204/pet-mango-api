import { t, type Static } from "elysia";

const InvitationDto = t.Object({
  id: t.Number(),
  roomId: t.Number(),
  roomName: t.String(),
  createdAt: t.Date(),
});

export const PendingInvitesRequest = t.Object({
  user: t.Number(),
});

export const PendingInvitesResponse = t.Object({
  invitations: t.Array(InvitationDto),
});

export type PendingInvitesRequest = Static<typeof PendingInvitesRequest>;
export type PendingInvitesResponse = Static<typeof PendingInvitesResponse>;
