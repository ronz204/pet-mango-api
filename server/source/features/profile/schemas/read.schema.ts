import { t, type Static } from "elysia";

export const ReadHeaders = t.Object({
  authorization: t.Optional(t.String()),
});

export const ReadRequest = t.Object({
  id: t.Number(),
});

export const ReadResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type ReadRequest = Static<typeof ReadRequest>;
export type ReadResponse = Static<typeof ReadResponse>;
