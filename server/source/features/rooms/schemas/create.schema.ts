import { t, type Static } from "elysia";
import { RoomVisibility } from "@prisma/enums";

export const CreateRoomBody = t.Object({
  name: t.String({ minLength: 3, maxLength: 50 }),
  visibility: t.Enum(RoomVisibility),
});

export const CreateRoomRequest = t.Object({
  body: CreateRoomBody,
  user: t.Number(),
});

export const CreateRoomResponse = t.Object({
  id: t.Number(),
  name: t.String(),
});

export type CreateRoomRequest = Static<typeof CreateRoomRequest>;
export type CreateRoomResponse = Static<typeof CreateRoomResponse>;
