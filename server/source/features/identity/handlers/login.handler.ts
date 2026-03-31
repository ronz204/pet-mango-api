import { PrismaClient } from "@prisma/client";
import { LoginUserMapper } from "../mapping/login.mapper";
import { UserExistsSpecify } from "@dal/users/exists.specify";

import type { Handler } from "@contracts/handler.contract";
import type { LoginUserRequest as Request } from "../schemas/login.schema";
import type { LoginUserPayload as Payload } from "../schemas/login.schema";

export class LoginUserHandler implements Handler<Request, Payload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Payload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (!exists) throw new Error("User not found");

    const isValid = await this.verify(request, exists.password);
    if (!isValid) throw new Error("Invalid password");

    return LoginUserMapper.toResponse(exists);
  };

  private async verify(request: Request, hashed: string): Promise<boolean> {
    return await Bun.password.verify(request.body.password, hashed);
  };
};
