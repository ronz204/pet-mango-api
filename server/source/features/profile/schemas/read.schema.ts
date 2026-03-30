import { t, type Static } from "elysia";

export const ReadProfileRequest = t.Object({
  id: t.Number(),
});

export const ReadProfileResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type ReadProfileRequest = Static<typeof ReadProfileRequest>;
export type ReadProfileResponse = Static<typeof ReadProfileResponse>;
