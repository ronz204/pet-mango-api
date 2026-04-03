import { LeaveMapper } from "./leave.mapper";
import { RoomRepository } from "@repos/rooms/room.repo";

import type { LeaveRequest } from "./leave.schema";
import type { LeaveResponse } from "./leave.schema";

export class LeaveHandler {
  constructor(private repo: RoomRepository) {};

  public async handle(request: LeaveRequest): Promise<LeaveResponse> {
    const { roomId } = request.params;
    const userId = request.userId;

    const room = await this.repo.exists({ id: roomId });
    if (!room) throw new Error("Room not found");

    const isMember = await this.repo.isMember({ roomId, userId });
    if (!isMember) throw new Error("User is not a member of the room");

    await this.repo.leave({ roomId, userId });
    return LeaveMapper.toResponse();
  };
};
