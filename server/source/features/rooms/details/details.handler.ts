import { DetailsMapper } from "./details.mapper";
import { RoomRepository } from "@repos/rooms/room.repo";

import type { DetailsRequest } from "./details.schema";
import type { DetailsResponse } from "./details.schema";

export class DetailsHandler {
  constructor(private repo: RoomRepository) {};

  public async handle(request: DetailsRequest): Promise<DetailsResponse> {
    const details = await this.repo.details(request.params);
    if (!details) throw new Error("Room not found");
    return DetailsMapper.toResponse({ data: details });
  };
};
