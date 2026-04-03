import { SendMapper } from "./send.mapper";
import { RoomRepository } from "@repos/rooms/room.repo";

import type { SendRequest } from "./send.schema";
import type { SendResponse } from "./send.schema";

export class SendHandler {
  constructor(private repo: RoomRepository) {};

  public async handle ({ body }: SendRequest): Promise<SendResponse> {
    const { roomId, inviteeId } = body;

    const isMember = await this.repo.isMember({ roomId, userId: inviteeId });
    if (isMember) throw new Error("User is already a member of the room");

    const invitation = await this.repo.invite(body);
    return SendMapper.toResponse(invitation);
  };
};
