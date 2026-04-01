import { Elysia } from "elysia";
import { SendInvitePlugin } from "./plugins/send.plugin";
import { PendingInvitesPlugin } from "./plugins/pending.plugin";

const prefix: string = "/invites";
const name: string = "invites.plugin";

export const InvitesPlugin = new Elysia({ name, prefix })
  .use(SendInvitePlugin)
  .use(PendingInvitesPlugin);
