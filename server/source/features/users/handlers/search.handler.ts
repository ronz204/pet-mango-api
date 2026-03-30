import { PrismaClient } from "@prisma/client";
import { SearchUsersMapper } from "../mapping/search.mapper";
import { SearchUsersSpecify } from "@dal/users/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SearchUsersRequest } from "../schemas/search.schema";
import type { SearchUsersResponse } from "../schemas/search.schema";

export class SearchUsersHandler implements Handler<SearchUsersRequest, SearchUsersResponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: SearchUsersRequest): Promise<SearchUsersResponse> {
    const searchQuery = new SearchUsersSpecify({
      ...request.query, id: request.user
    }).toQuery();

    const users = await this.prisma.user.findMany(searchQuery);
    return SearchUsersMapper.toResponse(users);
  };
};
