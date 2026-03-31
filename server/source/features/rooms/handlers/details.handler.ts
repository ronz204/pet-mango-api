import { PrismaClient } from "@prisma/client";
import { DetailsRoomMapper } from "../mapping/details.mapper";
import { DetailsRoomSpecify } from "@dal/rooms/details.specify";

import type { Handler } from "@contracts/handler.contract";
import type { DetailsRoomRequest as Request } from "../schemas/details.schema";
import type { DetailsRoomResponse as Response } from "../schemas/details.schema";

export class DetailsRoomHandler implements Handler<Request, Response> {
  constructor (private readonly prisma: PrismaClient) {};

  public async handle (request: Request): Promise<any> {
    const detailsQuery = new DetailsRoomSpecify({
      roomId: request.params.id,
    }).toQuery();

    const room = await this.prisma.room.findFirst(detailsQuery);
    if (!room) throw new Error("Room not found");

    return DetailsRoomMapper.toResponse({ data: room });
  };
};
