import { t, type Static } from "elysia";
import { RoomVisibility } from "@prisma/enums";

const RoomDto = t.Object({
  id: t.Number(),
  name: t.String(),
  members: t.Number(),
});

export const SearchRoomsQuery = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 50 })),
});

export const SearchRoomsRequest = t.Object({
  query: SearchRoomsQuery,
  user: t.Number(),
  isOwn: t.Boolean(),
  visible: t.Optional(t.Enum(RoomVisibility)),
});

export const SearchRoomsResponse = t.Object({
  rooms: t.Array(RoomDto),
});

export type SearchRoomsRequest = Static<typeof SearchRoomsRequest>;
export type SearchRoomsResponse = Static<typeof SearchRoomsResponse>;
