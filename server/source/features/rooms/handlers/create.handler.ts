import { PrismaClient } from "@prisma/client";
import { CreateRoomMapper } from "../mapping/create.mapper";
import { CreateRoomSpecify } from "@dal/rooms/create.specify";
import { RoomExistsSpecify } from "@dal/rooms/exists.specify";

import type { Handler } from "@contracts/handler.contract";
import type { CreateRoomRequest as Request } from "../schemas/create.schema";
import type { CreateRoomResponse as Response } from "../schemas/create.schema";

export class CreateRoomHandler implements Handler<Request, Response> {
  constructor (private readonly prisma: PrismaClient) {};

  public async handle (request: Request): Promise<Response> {
    const existsQuery = new RoomExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.room.count(existsQuery);
    if (exists) throw new Error("Room with this name already exists");

    const createQuery = new CreateRoomSpecify({
      ...request.body, userId: request.user,
    }).toQuery();

    const created = await this.prisma.room.create(createQuery);
    return CreateRoomMapper.toResponse(created);
  };
};
