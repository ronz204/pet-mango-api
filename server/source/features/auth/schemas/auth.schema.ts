import { t } from "elysia";

export const TokenSchema = t.Object({
  id: t.Number(),
});

export const Unauthorized = t.Object({
  error: t.Literal("Unauthorized"),
  message: t.String(),
});
