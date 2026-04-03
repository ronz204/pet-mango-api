import { PrismaClient } from "@prisma/client";
import { MemberRole } from "@prisma/client";
import type { RepoArgs } from "./repo.args";

export class RoomRepository {
  constructor(private readonly prisma: PrismaClient) {};

  public async exists(args: RepoArgs.Exists) {
    return await this.prisma.room.findFirst({ where: {
      id: args.id, name: args.name,
    }});
  };

  public async create(args: RepoArgs.Create) {
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
