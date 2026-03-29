import { t, type Static } from "elysia";

export const SignInBody = t.Object({
  email: t.String(),
  password: t.String(),
});

export const SignInResponse = t.Object({
  token: t.String(),
});

export const SignInInput = t.Object({
  body: SignInBody,
});

export const SignInOutput = t.Object({
  user: t.Number(),
});

export type SignInInput = Static<typeof SignInInput>;
export type SignInOutput = Static<typeof SignInOutput>;
