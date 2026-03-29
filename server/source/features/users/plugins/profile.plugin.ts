import { Elysia } from "elysia";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { ProfileHeaders } from "../schemas/profile.schema";
import { ProfileResponse } from "../schemas/profile.schema";

export const ProfilePlugin = new Elysia({ name: "profile.plugin" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .get("/me", async ({ status, jwt }) => {
    return status(200, {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    });
  }, {
    headers: ProfileHeaders,
    response: { 200: ProfileResponse },
  });
