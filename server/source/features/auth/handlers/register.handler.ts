import { PrismaClient } from "@prisma/client";
import { UserExistsSpecify } from "@dal/users/exists.specify";
import { RegisterMapper } from "../mapping/register.mapper";
import { RegisterUserSpecify } from "@dal/users/register.specify";

import type { Handler } from "@contracts/handler.contract";
import type { RegisterRequest } from "../schemas/register.schema";
import type { RegisterPayload } from "../schemas/register.schema";

export class RegisterHandler implements Handler<RegisterRequest, RegisterPayload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: RegisterRequest): Promise<RegisterPayload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (exists) throw new Error("User already exists");

    request.body.password = await this.hash(request);

    const createQuery = new RegisterUserSpecify(request.body).toQuery();
    const created = await this.prisma.user.create(createQuery);

    return RegisterMapper.toResponse(created);
  };

  private async hash(request: RegisterRequest): Promise<string> {
    return await Bun.password.hash(request.body.password);
  };
};
