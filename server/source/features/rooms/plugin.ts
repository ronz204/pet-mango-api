import { Elysia } from "elysia";
import { CreateRoomPlugin } from "./plugins/create.plugin";
import { SearchRoomsPlugin } from "./plugins/search.plugin";
import { DetailsRoomPlugin } from "./plugins/details.plugin";
import { RetrieveRoomsPlugin } from "./plugins/retrieve.plugin";
import { JoinRoomPlugin } from "./plugins/join.plugin";
import { LeaveRoomPlugin } from "./plugins/leave.plugin";

const prefix: string = "/rooms";
const name: string = "rooms.plugin";

export const RoomsPlugin = new Elysia({ name, prefix })
  .use(CreateRoomPlugin)
  .use(DetailsRoomPlugin)
  .use(SearchRoomsPlugin)
  .use(RetrieveRoomsPlugin)
  .use(JoinRoomPlugin)
  .use(LeaveRoomPlugin);
