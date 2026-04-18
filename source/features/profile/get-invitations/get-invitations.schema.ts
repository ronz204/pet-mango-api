import { t, type Static } from "elysia";
import { InvitationDto } from "@dal/invitations/invite.dto";

export const GetMyInvitationsRequest = t.Object({
  userId: t.Number(),
});

export const GetMyInvitationsResponse = t.Object({
  invitations: t.Array(InvitationDto),
});

export type GetMyInvitationsRequest = Static<typeof GetMyInvitationsRequest>;
export type GetMyInvitationsResponse = Static<typeof GetMyInvitationsResponse>;
