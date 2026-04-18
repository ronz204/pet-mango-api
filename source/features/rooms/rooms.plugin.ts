import { Elysia } from "elysia";
import { GetMessagesPlugin } from "./get-messages/get-messages.plugin";

const prefix: string = "/rooms";
const name: string = "rooms.plugin";

export const RoomsPlugin = new Elysia({ name, prefix })
  .use(GetMessagesPlugin);
