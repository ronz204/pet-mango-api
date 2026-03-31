import { PrismaClient } from "@prisma/client";
import { SearchRoomsMapper } from "../mapping/search.mapper";
import { SearchRoomsSpecify } from "@dal/rooms/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SearchRoomsRequest as Request } from "../schemas/search.schema";
import type { SearchRoomsResponse as Response } from "../schemas/search.schema";

export class SearchRoomsHandler implements Handler<Request, Response> {
  constructor (private readonly prisma: PrismaClient) {};

  public async handle (request: Request): Promise<Response> {
    const searchQuery = new SearchRoomsSpecify({
      ...request.query, userId: request.user,
    }).toQuery();

    const rooms = await this.prisma.room.findMany(searchQuery);
    return SearchRoomsMapper.toResponse({ data: rooms });
  };
};
