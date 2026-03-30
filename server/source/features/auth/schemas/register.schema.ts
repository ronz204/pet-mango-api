import { t, type Static } from "elysia";

export const RegisterUserBody = t.Object({
  name: t.String({ minLength: 4, maxLength: 20 }),
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

export const RegisterUserRequest = t.Object({
  body: RegisterUserBody,
});

export const RegisterUserPayload = t.Object({
  id: t.Number(),
});

export const RegisterUserResponse = t.Object({
  token: t.String(),
});

export type RegisterUserRequest = Static<typeof RegisterUserRequest>;
export type RegisterUserPayload = Static<typeof RegisterUserPayload>;
export type RegisterUserResponse = Static<typeof RegisterUserResponse>;
