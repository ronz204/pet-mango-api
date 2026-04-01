import { t, type Static } from "elysia";
import { InvitationStatus } from "@prisma/enums";

export const UpdateInviteParams = t.Object({
  id: t.Number(),
});

export const UpdateInviteBody = t.Object({
  status: t.Union([
    t.Literal(InvitationStatus.ACCEPTED),
    t.Literal(InvitationStatus.DECLINED),
  ]),
});

export const UpdateInviteRequest = t.Object({
  params: UpdateInviteParams,
  body: UpdateInviteBody,
  user: t.Number(),
});

export const UpdateInviteResponse = t.Object({
  id: t.Number(),
  status: t.Enum(InvitationStatus),
  roomId: t.Number(),
});

export type UpdateInviteRequest = Static<typeof UpdateInviteRequest>;
export type UpdateInviteResponse = Static<typeof UpdateInviteResponse>;
