import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { ReadProfileResponse } from "../schemas/read.schema";
import { ReadProfileHandler } from "../handlers/read.handler";

export const ReadPlugin = new Elysia({ name: "read.profile" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    readH: new ReadProfileHandler(prisma),
  }))

  .get("/me", async ({ status, user, readH }) => {
    const response = await readH.handle({ id: user });
    return status(200, response);
  }, {
    auth: true,
    response: {
      200: ReadProfileResponse,
    },
  });
