import { CreateMapper } from "./create.mapper";
import { RoomRepository } from "@repos/rooms/room.repo";

import type { CreateRequest } from "./create.schema";
import type { CreateResponse } from "./create.schema";

export class CreateHandler {
  constructor(private repo: RoomRepository) {};  

  public async handle (request: CreateRequest): Promise<CreateResponse> {
    const exists = await this.repo.exists({ name: request.body.name });
    if (exists) throw new Error("Room already exists");

    const created = await this.repo.create({
      name: request.body.name, ownerId: request.userId });

    return CreateMapper.toResponse(created);
  };
};
