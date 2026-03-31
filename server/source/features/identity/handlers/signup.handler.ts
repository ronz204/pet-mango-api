import { PrismaClient } from "@prisma/client";
import { SignUpMapper } from "../mapping/signup.mapper";
import { UserExistsSpecify } from "@dal/users/exists.specify";
import { RegisterUserSpecify } from "@dal/users/register.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SignUpRequest as Request } from "../schemas/signup.schema";
import type { SignUpPayload as Payload } from "../schemas/signup.schema";

export class SignUpHandler implements Handler<Request, Payload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Payload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (exists) throw new Error("User already exists");

    const createQuery = new RegisterUserSpecify({
      ...request.body, password: await this.hash(request)
    }).toQuery();

    const created = await this.prisma.user.create(createQuery);
    return SignUpMapper.toResponse(created);
  };

  private async hash(request: Request): Promise<string> {
    return await Bun.password.hash(request.body.password);
  };
};
