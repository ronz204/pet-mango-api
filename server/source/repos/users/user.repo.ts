import { PrismaClient } from "@prisma/client";
import { UserArgs } from "./user.args";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {};

  public async exists(args: UserArgs.Exists) {
    return await this.prisma.user.findFirst({ where: {
      id: args.id, name: args.name, email: args.email,
    }});
  };

  public async search(args: UserArgs.Search) {
    return await this.prisma.user.findFirst({ where: {
      name: args.name, id: { not: args.userId }
    }});
  };

  public async create(args: UserArgs.Create) {
    return await this.prisma.user.create({ data: args.data });
  };

  public async update(args: UserArgs.Update) {
    return await this.prisma.user.update({
      where: { id: args.userId }, data: args.data,
    });
  };
};
