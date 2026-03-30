import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthSchema } from "./auth.schema";
import { AuthHeaders } from "./auth.schema";
import { AuthResponse } from "./auth.schema";

export const TokenPlugin = new Elysia({ name: "token.plugin" })
  .use(jwt({
    exp: "1h",
    name: "jwt",
    schema: AuthSchema,
    secret: process.env.JWT_SECRET!,
  }))

  .macro({
    auth: {
      headers: AuthHeaders,
      response: AuthResponse,
      resolve: async ({ status, headers, jwt }) => {
        const status401 = status(401, {
          error: "Unauthorized",
          message: "Not authorized to access this resource."
        });

        const auth = headers["authorization"];
        if (!auth?.startsWith("Bearer ")) return status401;

        const payload = await jwt.verify(auth.slice(7));
        if (!payload) return status401;

        return { user: payload.id };
      },
    },
  });
