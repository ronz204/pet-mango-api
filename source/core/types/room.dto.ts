import { t, type Static } from "elysia";

export const RoomDto = t.Object({
  id: t.Number(),
  name: t.String(),
});

export type RoomDto = Static<typeof RoomDto>;
