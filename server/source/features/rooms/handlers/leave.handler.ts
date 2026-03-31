import { PrismaClient } from "@prisma/client";
import { LeaveRoomMapper } from "../mapping/leave.mapper";
import { MemberExistsSpecify } from "@dal/member/exists.specify";
import { DeleteMemberSpecify } from "@dal/member/delete.specify";

import type { Handler } from "@contracts/handler.contract";
import type { LeaveRoomRequest as Request } from "../schemas/leave.schema";
import type { LeaveRoomResponse as Response } from "../schemas/leave.schema";

export class LeaveRoomHandler implements Handler<Request, Response> {
  constructor (private readonly prisma: PrismaClient) {};

  public async handle (request: Request): Promise<Response> {
    const roomId = request.params.roomId;
    const userId = request.user;

    // Check if room exists
    const room = await this.prisma.room.findFirst({ where: { id: roomId }});
    if (!room) throw new Error("Room not found");

    // Check if user is a member
    const existsQuery = new MemberExistsSpecify({ userId, roomId }).toQuery();
    const isMember = await this.prisma.member.count(existsQuery);

    if (isMember === 0) {
      throw new Error("You are not a member of this room");
    }

    // Delete member
    const deleteQuery = new DeleteMemberSpecify({ userId, roomId }).toQuery();
    await this.prisma.member.delete(deleteQuery);

    return LeaveRoomMapper.toResponse();
  };
};
