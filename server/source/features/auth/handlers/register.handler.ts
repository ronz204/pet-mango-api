import { PrismaClient } from "@prisma/client";
import { RegisterMapper } from "../mapping/register.mapper";
import { SearchUserSpecify } from "@features/users/prisma/search.specify";
import { RegisterUserSpecify } from "@features/users/prisma/register.specify";

import type { Handler } from "@contracts/handler.contract";
import type { RegisterInput } from "../schemas/register.schema";
import type { RegisterOutput } from "../schemas/register.schema";

export class RegisterHandler implements Handler<RegisterInput, RegisterOutput> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: RegisterInput): Promise<RegisterOutput> {
    const existsQuery = new SearchUserSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (exists) throw new Error("User already exists");

    request.body.password = await this.hash(request);

    const createQuery = new RegisterUserSpecify(request.body).toQuery();
    const created = await this.prisma.user.create(createQuery);

    return RegisterMapper.toOutput(created);
  };

  private async hash(request: RegisterInput): Promise<string> {
    return await Bun.password.hash(request.body.password);
  };
};
