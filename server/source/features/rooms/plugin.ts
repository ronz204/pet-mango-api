import { Elysia } from "elysia";
import { LeaveRoomPlugin } from "./plugins/leave.plugin";
import { CreateRoomPlugin } from "./plugins/create.plugin";
import { SearchRoomsPlugin } from "./plugins/search.plugin";
import { DetailsRoomPlugin } from "./plugins/details.plugin";

const prefix: string = "/rooms";
const name: string = "rooms.plugin";

export const RoomsPlugin = new Elysia({ name, prefix })
  .use(LeaveRoomPlugin)
  .use(CreateRoomPlugin)
  .use(DetailsRoomPlugin)
  .use(SearchRoomsPlugin);
