import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";
import { TokenSchema } from "@features/auth/schemas/auth.schema";
import { Unauthorized } from "@features/auth/schemas/auth.schema";

export const TokenPlugin = new Elysia({ name: "token.plugin" })
  .use(jwt({
    exp: "1h",
    name: "jwt",
    schema: TokenSchema,
    secret: process.env.JWT_SECRET!,
  }))

  .derive({ as: "global" }, async ({ headers, jwt }) => {
    const auth = headers["authorization"];
    if (!auth?.startsWith("Bearer ")) return {};

    const payload = await jwt.verify(auth.slice(7));
    if (!payload) return {};

    return { user: payload.id };
  })

  .macro({
    auth: {
      response: { 401: Unauthorized },

      resolve({ user, status }) {
        if (!user) return status(401, {
          error: "Unauthorized",
          message: "You are not authorized to access this resource."
        });
        return { user };
      },
    },
  });
