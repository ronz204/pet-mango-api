import { t, type Static } from "elysia";

export const ProfileUserRequest = t.Object({
  user: t.Number(),
});

export const ProfileUserResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type ProfileUserRequest = Static<typeof ProfileUserRequest>;
export type ProfileUserResponse = Static<typeof ProfileUserResponse>;
