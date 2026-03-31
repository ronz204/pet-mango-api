import { t, type Static } from "elysia";

export const JoinRoomParams = t.Object({
  roomId: t.Numeric(),
});

export const JoinRoomRequest = t.Object({
  params: JoinRoomParams,
  user: t.Number(),
});

export const JoinRoomResponse = t.Object({
  id: t.Number(),
  roomId: t.Number(),
  userId: t.Number(),
  role: t.String(),
});

export type JoinRoomRequest = Static<typeof JoinRoomRequest>;
export type JoinRoomResponse = Static<typeof JoinRoomResponse>;
