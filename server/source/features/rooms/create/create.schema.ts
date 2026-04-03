import { t, type Static } from "elysia";
import { RoomVisibility } from "@prisma/enums";

export const CreateBody = t.Object({
  name: t.String({ minLength: 3, maxLength: 50 }),
  visibility: t.Optional(t.Enum(RoomVisibility)),
});

export const CreateRequest = t.Object({
  body: CreateBody,
  userId: t.Number(),
});

export const CreateResponse = t.Object({
  id: t.Number(),
  name: t.String(),
});

export type CreateRequest = Static<typeof CreateRequest>;
export type CreateResponse = Static<typeof CreateResponse>;
