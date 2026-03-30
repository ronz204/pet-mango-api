import { t, type Static } from "elysia";

export const LoginUserBody = t.Object({
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

const LoginUserRequest = t.Object({
  body: LoginUserBody,
});

const LoginUserPayload = t.Object({
  id: t.Number(),
});

export const LoginUserResponse = t.Object({
  token: t.String(),
});

export type LoginUserRequest = Static<typeof LoginUserRequest>;
export type LoginUserPayload = Static<typeof LoginUserPayload>;
