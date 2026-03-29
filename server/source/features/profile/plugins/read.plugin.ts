import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { ReadHeaders } from "../schemas/read.schema";
import { ReadResponse } from "../schemas/read.schema";
import { ReadHandler } from "../handlers/read.handler";
import { PrismaPlugin } from "@database/prisma.plugin";

export const ReadPlugin = new Elysia({ name: "read.profile" })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    readH: new ReadHandler(prisma),
  }))

  .get("/me", async ({ status, user, readH }) => {
    const response = await readH.handle({ id: user });
    return status(200, response);
  }, {
    auth: true,
    headers: ReadHeaders,
    response: { 200: ReadResponse },
  });
