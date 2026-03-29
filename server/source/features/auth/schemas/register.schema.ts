import { t, type Static } from "elysia";
import { LoginBody } from "./login.schema";

export const RegisterBody = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
});

export const RegisterResponse = t.Object({
  token: t.String(),
});

export const RegisterInput = t.Object({
  body: RegisterBody,
});

export const RegisterOutput = t.Object({
  user: t.Number(),
});

export type RegisterInput = Static<typeof RegisterInput>;
export type RegisterOutput = Static<typeof RegisterOutput>;
