import { PrismaClient } from "@prisma/client";
import type { RepoArgs } from "./repo.args";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {};

  public async exists(args: RepoArgs.Exists) {
    return await this.prisma.user.findFirst({ where: {
      id: args.id, name: args.name, email: args.email,
    }});
  };

  public async search(args: RepoArgs.Search) {
    return await this.prisma.user.findFirst({ where: {
      name: args.name, id: { not: args.userId }
    }});
  };

  public async create(args: RepoArgs.Create) {
    return await this.prisma.user.create({ data: args.data });
  };

  public async update(args: RepoArgs.Update) {
    return await this.prisma.user.update({
      where: { id: args.userId }, data: args.data,
    });
  };
};
