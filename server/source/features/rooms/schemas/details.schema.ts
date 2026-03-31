import { t, type Static } from "elysia";

const MemberDto = t.Object({
  id: t.Number(),
  userId: t.Number(),
  userName: t.String(),
});

const MessageDto = t.Object({
  id: t.Number(),
  content: t.String(),
  senderId: t.Number(),
  senderName: t.String(),
});

export const DetailsRoomParams = t.Object({
  id: t.Number(),
});

export const DetailsRoomRequest = t.Object({
  params: DetailsRoomParams,
  user: t.Number(),
});

export const DetailsRoomResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  members: t.Array(MemberDto),
  messages: t.Array(MessageDto),
});

export type DetailsRoomRequest = Static<typeof DetailsRoomRequest>;
export type DetailsRoomResponse = Static<typeof DetailsRoomResponse>;
