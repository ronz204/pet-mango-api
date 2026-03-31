import { Elysia, type ElysiaConfig } from "elysia";
import { CreateRoomPlugin } from "./plugins/create.plugin";

const config: ElysiaConfig<"/rooms"> = {
  prefix: "/rooms", name: "rooms.plugin"
};

export const RoomsPlugin = new Elysia(config)
  .use(CreateRoomPlugin);
