import { PrismaClient } from "@prisma/client";
import { MemberRole } from "@prisma/client";
import { RoomArgs } from "./room.args";

export class RoomRepository {
  constructor(private readonly prisma: PrismaClient) {};

  public async exists(args: RoomArgs.Exists) {
    return await this.prisma.room.findFirst({ where: {
      id: args.id, name: args.name,
    }});
  };

  public async isMember(args: RoomArgs.IsMember) {
    return await this.prisma.member.findFirst({
      where: { userId: args.userId, roomId: args.roomId }
    });
  };

  public async invite(args: RoomArgs.Invite) {
    return await this.prisma.invitation.create({ data: {
      roomId: args.roomId, inviteeId: args.inviteeId,
    }});
  };

  public async details(args: RoomArgs.Details) {
    return await this.prisma.room.findUnique({
      where: { id: args.roomId },
      include: {
        members: { include: { user: true }},
        messages: { include: { sender: true }},
    }});
  };

  public async leave(args: RoomArgs.Leave) {
    return await this.prisma.member.delete({ where:
      { userId_roomId: { userId: args.userId, roomId: args.roomId }}
    });
  };

  public async create(args: RoomArgs.Create) {
    return await this.prisma.room.create({ data: {
      name: args.name, members: {
        create: {
          userId: args.ownerId,
          role: MemberRole.ADMIN
        },
      },
    }});
  };
};
