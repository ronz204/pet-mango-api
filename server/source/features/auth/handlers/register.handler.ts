import { PrismaClient } from "@prisma/client";
import { UserExistsSpecify } from "@dal/users/exists.specify";
import { RegisterUserMapper } from "../mapping/register.mapper";
import { RegisterUserSpecify } from "@dal/users/register.specify";

import type { Handler } from "@contracts/handler.contract";
import type { RegisterUserRequest } from "../schemas/register.schema";
import type { RegisterUserPayload } from "../schemas/register.schema";

export class RegisterUserHandler implements Handler<RegisterUserRequest, RegisterUserPayload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: RegisterUserRequest): Promise<RegisterUserPayload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (exists) throw new Error("User already exists");

    request.body.password = await this.hash(request);

    const createQuery = new RegisterUserSpecify(request.body).toQuery();
    const created = await this.prisma.user.create(createQuery);

    return RegisterUserMapper.toResponse(created);
  };

  private async hash(request: RegisterUserRequest): Promise<string> {
    return await Bun.password.hash(request.body.password);
  };
};
