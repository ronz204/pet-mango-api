import { Elysia } from "elysia";
import { TokenPlugin } from "@auth/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { SearchUsersQuery } from "../schemas/search.schema";
import { SearchUsersResponse } from "../schemas/search.schema";
import { SearchUsersHandler } from "../handlers/search.handler";

const name: string = "search.users.plugin";

export const SearchUsersPlugin = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ prisma }) => ({
    searchH: new SearchUsersHandler(prisma),
  }))

  .get("/", async ({ status, query, searchH, user }) => {
    const response = await searchH.handle({ query, user });
    return status(200, response);
  }, {
    auth: true,
    query: SearchUsersQuery,
    response: {
      200: SearchUsersResponse,
    },
  });
