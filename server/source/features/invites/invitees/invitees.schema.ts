import { t, type Static } from "elysia";

const UserDto = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export const InviteesParams = t.Object({
  roomId: t.Number({ minimum: 1 }),
});

export const InviteesRequest = t.Object({
  params: InviteesParams,
});

export const InviteesResponse = t.Object({
  users: t.Array(UserDto),
});

export type InviteesRequest = Static<typeof InviteesRequest>;
export type InviteesResponse = Static<typeof InviteesResponse>;
