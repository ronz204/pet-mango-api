import { RoomVisibility } from "@prisma/client";
import { t, type Static } from "elysia";

const RoomDto = t.Object({
  id: t.Number(),
  name: t.String(),
  members: t.Number(),
});

export const SearchRoomsQuery = t.Object({
  isOwn: t.Boolean({ default: false }),
  visibility: t.Optional(t.Enum(RoomVisibility)),
  name: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
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
