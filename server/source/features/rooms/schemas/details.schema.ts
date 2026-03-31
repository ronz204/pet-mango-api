import { t, type Static } from "elysia";

const MemberDto = t.Object({
  id: t.Number(),
  name: t.String(),
  userId: t.Number(),
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
});

export type DetailsRoomRequest = Static<typeof DetailsRoomRequest>;
export type DetailsRoomResponse = Static<typeof DetailsRoomResponse>;
