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

  public async details(args: RoomArgs.Details) {
    return await this.prisma.room.findUnique({
      where: { id: args.roomId },
      include: {
        members: { include: { user: true }},
        messages: { include: { sender: true }},
    }});
  }

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
