import { InviteesMapper } from "./invitees.mapper";
import { RoomRepository } from "@repos/rooms/room.repo";

import type { InviteesRequest } from "./invitees.schema";
import type { InviteesResponse } from "./invitees.schema";

export class InviteesHandler {
  constructor(private repo: RoomRepository) {};

  public async handle(request: InviteesRequest): Promise<InviteesResponse> {
    const users = await this.repo.invitees(request.params);
    return InviteesMapper.toResponse({ data: users });
  };
};
