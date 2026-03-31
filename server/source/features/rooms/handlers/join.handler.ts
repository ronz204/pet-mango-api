import { PrismaClient } from "@prisma/client";
import { RoomVisibility } from "@prisma/enums";
import { JoinRoomMapper } from "../mapping/join.mapper";
import { JoinRoomSpecify } from "@dal/rooms/join.specify";
import { MemberExistsSpecify } from "@dal/member/exists.specify";

import type { Handler } from "@contracts/handler.contract";
import type { JoinRoomRequest as Request } from "../schemas/join.schema";
import type { JoinRoomResponse as Response } from "../schemas/join.schema";

export class JoinRoomHandler implements Handler<Request, Response> {
  constructor (private readonly prisma: PrismaClient) {};

  public async handle (request: Request): Promise<Response> {
    const roomId = request.params.roomId;
    const userId = request.user;

    // Check if room exists
    const room = await this.prisma.room.findFirst({ where: { id: roomId }});
    if (!room) throw new Error("Room not found");

    // Check if room is public
    if (room.visibility !== RoomVisibility.PUBLIC) {
      throw new Error("Cannot join private room");
    };

    // Check if user is already a member
    const existsQuery = new MemberExistsSpecify({ userId, roomId }).toQuery();
    
    const isMember = await this.prisma.member.count(existsQuery);
    if (isMember > 0) throw new Error("You are already a member of this room");

    const joinQuery = new JoinRoomSpecify({ userId, roomId }).toQuery();
    const member = await this.prisma.member.create(joinQuery);
    
    return JoinRoomMapper.toResponse(member);
  };
};
