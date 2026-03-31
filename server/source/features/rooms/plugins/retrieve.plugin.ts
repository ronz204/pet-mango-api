import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SearchRoomsQuery } from "../schemas/search.schema";
import { SearchRoomsResponse } from "../schemas/search.schema";
import { SearchRoomsHandler } from "../handlers/search.handler";

const name: string = "retrieve.rooms.plugin";

export const RetrieveRoomsPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    searchH: new SearchRoomsHandler(prisma),
  }))

  .get("/", async ({ status, query, user, searchH }) => {
    const response = await searchH.handle({
      query, user, isOwn: true
    });
    
    return status(200, response);
  }, {
    auth: true,
    query: SearchRoomsQuery,
    response: {
      200: SearchRoomsResponse
    },
  });
