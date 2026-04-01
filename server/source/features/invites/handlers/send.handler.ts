import { PrismaClient } from "@prisma/client";
import { SendInviteMapper } from "../mapping/send.mapper";
import { SendInviteSpecify } from "@dal/invites/send.specify";
import { RoomExistsSpecify } from "@dal/rooms/exists.specify";
import { UserExistsSpecify } from "@dal/users/exists.specify";
import { MemberExistsSpecify } from "@dal/member/exists.specify";
import { InviteExistsSpecify } from "@dal/invites/exists.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SendInviteRequest as Request } from "../schemas/send.schema";
import type { SendInviteResponse as Response } from "../schemas/send.schema";

export class SendInviteHandler implements Handler<Request, Response> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Response> {
    const { roomId, inviteeId } = request.body;

    const roomExistsQuery = new RoomExistsSpecify({ id: roomId }).toQuery();
    const roomExists = await this.prisma.room.count(roomExistsQuery);
    if (!roomExists) throw new Error("Room not found");

    const userExistsQuery = new UserExistsSpecify({ id: inviteeId }).toQuery();
    const userExists = await this.prisma.user.count(userExistsQuery);
    if (!userExists) throw new Error("User not found");

    const memberExistsQuery = new MemberExistsSpecify({
      userId: request.user, roomId: roomId }).toQuery();

    const isMember = await this.prisma.member.count(memberExistsQuery);
    if (!isMember) throw new Error("You must be a member of the room to send invitations");

    const inviteExistsQuery = new InviteExistsSpecify({
        roomId, inviteeId }).toQuery();

    const inviteExists = await this.prisma.invitation.count(inviteExistsQuery);
    if (inviteExists) throw new Error("Invitation already exists");


    const createQuery = new SendInviteSpecify({ roomId, inviteeId }).toQuery();
    const invitation = await this.prisma.invitation.create(createQuery);
    return SendInviteMapper.toResponse(invitation);
  };
};
