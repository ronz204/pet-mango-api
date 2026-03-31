import { RoomVisibility } from "@prisma/client";
import { t, type Static } from "elysia";

const RoomDto = t.Object({
  id: t.Number(),
  name: t.String(),
  members: t.Number(),
});

export const SearchRoomsQuery = t.Object({
  isOwn: t.Boolean({ default: false }),
  name: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
  visibility: t.Optional(t.Enum(RoomVisibility, { default: RoomVisibility.PUBLIC })),
});

export const SearchRoomsRequest = t.Object({
  query: SearchRoomsQuery,
  user: t.Number(),
});

export const SearchRoomsResponse = t.Object({
  rooms: t.Array(RoomDto),
});

export type SearchRoomsRequest = Static<typeof SearchRoomsRequest>;
export type SearchRoomsResponse = Static<typeof SearchRoomsResponse>;
