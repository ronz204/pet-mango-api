import { t, type Static } from "elysia";

export const RegisterBody = t.Object({
  name: t.String({ minLength: 4, maxLength: 20 }),
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

const RegisterRequest = t.Object({
  body: RegisterBody,
});

const RegisterPayload = t.Object({
  id: t.Number(),
});

export const RegisterResponse = t.Object({
  token: t.String(),
});

export type RegisterRequest = Static<typeof RegisterRequest>;
export type RegisterPayload = Static<typeof RegisterPayload>;
