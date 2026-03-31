import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { ProfileUserResponse } from "../schemas/profile.schema";
import { ProfileUserHandler } from "../handlers/profile.handler";

const name: string = "profile.user.plugin";

export const ProfileUserPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    profileH: new ProfileUserHandler(prisma),
  }))

  .get("/me", async ({ status, user, profileH }) => {
    const response = await profileH.handle({ id: user });
    return status(200, response);
  }, {
    auth: true,
    response: {
      200: ProfileUserResponse,
    },
  });
