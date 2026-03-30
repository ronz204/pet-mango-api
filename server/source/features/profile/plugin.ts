import { Elysia, type ElysiaConfig } from "elysia";
import { ReadPlugin } from "./plugins/read.plugin";
import { UpdatePlugin } from "./plugins/update.plugin";

const config: ElysiaConfig<"/profile"> = {
  prefix: "/profile", name: "profile.plugin"
};

export const ProfilePlugin = new Elysia(config)
  .use(ReadPlugin)
  .use(UpdatePlugin);
