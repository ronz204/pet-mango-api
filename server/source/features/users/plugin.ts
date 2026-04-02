import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { UserRepository } from "@repos/users/user.repo";

import { RefreshBody } from "./refresh/refresh.schema";
import { RefreshHandler } from "./refresh/refresh.handler";
import { RefreshResponse } from "./refresh/refresh.schema";

import { ProfileHandler } from "./profile/profile.handler";
import { ProfileResponse } from "./profile/profile.schema";

const name: string = "users.plugin";

export const UsersPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)
  
  .derive(({ prisma }) => {
    const repo = new UserRepository(prisma);
    const refreshH = new RefreshHandler(repo);
    const profileH = new ProfileHandler(repo);
    
    return { refreshH, profileH };
  })

  .get("/profile", async ({ status, userId, profileH }) => {
    const response = await profileH.handle({ userId });
    return status(200, response);
  }, {
    isAuth: true,
    response: {
      200: ProfileResponse
    },
  })
  
  .patch("/profile", async ({ status, body, userId, refreshH }) => {
    const response = await refreshH.handle({ userId, body });
    return status(200, response);
  }, {
    isAuth: true,
    body: RefreshBody,
    response: {
      200: RefreshResponse
    },
  });
