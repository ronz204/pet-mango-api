import { PrismaClient } from "@prisma/client";
import { UserExistsSpecify } from "@dal/users/exists.specify";
import { RegisterUserMapper } from "../mapping/register.mapper";
import { RegisterUserSpecify } from "@dal/users/register.specify";

import type { Handler } from "@contracts/handler.contract";
import type { RegisterUserRequest as Request } from "../schemas/register.schema";
import type { RegisterUserPayload as Payload } from "../schemas/register.schema";

export class RegisterUserHandler implements Handler<Request, Payload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Payload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (exists) throw new Error("User already exists");

    const createQuery = new RegisterUserSpecify({
      ...request.body, password: await this.hash(request)
    }).toQuery();

    const created = await this.prisma.user.create(createQuery);
    return RegisterUserMapper.toResponse(created);
  };

  private async hash(request: Request): Promise<string> {
    return await Bun.password.hash(request.body.password);
  };
};
