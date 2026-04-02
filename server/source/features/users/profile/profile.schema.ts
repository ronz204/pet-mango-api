import { t, type Static } from "elysia";

export const ProfileRequest = t.Object({
  userId: t.Number(),
});

export const ProfileResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type ProfileRequest = Static<typeof ProfileRequest>;
export type ProfileResponse = Static<typeof ProfileResponse>;
