import { t, type Static } from "elysia";

export const LoginBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

const LoginRequest = t.Object({
  body: LoginBody,
});

const LoginPayload = t.Object({
  id: t.Number(),
});

export const LoginResponse = t.Object({
  token: t.String(),
});

export type LoginRequest = Static<typeof LoginRequest>;
export type LoginPayload = Static<typeof LoginPayload>;
