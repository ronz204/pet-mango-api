import { t, type Static } from "elysia";
import { MemberRole } from "@prisma/enums";

const MemberDto = t.Object({
  id: t.Number(),
  userId: t.Number(),
  userName: t.String(),
  userRole: t.Enum(MemberRole),
});

const MessageDto = t.Object({
  id: t.Number(),
  content: t.String(),
  senderId: t.Number(),
  senderName: t.String(),
});

export const DetailsParams = t.Object({
  roomId: t.Number(),
});

export const DetailsRequest = t.Object({
  params: DetailsParams,
});

export const DetailsResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  members: t.Array(MemberDto),
  messages: t.Array(MessageDto),
});

export type DetailsRequest = Static<typeof DetailsRequest>;
export type DetailsResponse = Static<typeof DetailsResponse>;
