import { t, type Static } from "elysia";

export const UpdateUserBody = t.Object({
  name: t.Optional(t.String({ minLength: 4, maxLength: 20 })),
  password: t.Optional(t.String({ minLength: 8, maxLength: 64 })),
});

export const UpdateUserRequest = t.Object({
  body: UpdateUserBody,
  user: t.Number(),
});

export const UpdateUserResponse = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export type UpdateUserRequest = Static<typeof UpdateUserRequest>;
export type UpdateUserResponse = Static<typeof UpdateUserResponse>;
