import { t, type Static } from "elysia";

export const LoginBody = t.Object({
  email: t.String(),
  password: t.String(),
});

export const LoginResponse = t.Object({
  token: t.String(),
});

export const LoginInput = t.Object({
  body: LoginBody,
});

export const LoginOutput = t.Object({
  user: t.Number(),
});

export type LoginInput = Static<typeof LoginInput>;
export type LoginOutput = Static<typeof LoginOutput>;
