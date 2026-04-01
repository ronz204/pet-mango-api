import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { PendingInvitesResponse } from "../schemas/pending.schema";
import { PendingInvitesHandler } from "../handlers/pending.handler";

const name: string = "pending.invites.plugin";

export const PendingInvitesPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    pendingH: new PendingInvitesHandler(prisma),
  }))
  
  .get("/", async ({ status, user, pendingH }) => {
    const response = await pendingH.handle({ user });
    return status(200, response);
  }, {
    auth: true,
    response: {
      200: PendingInvitesResponse,
    },
  });
