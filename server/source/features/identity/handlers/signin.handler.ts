import { PrismaClient } from "@prisma/client";
import { SignInMapper } from "../mapping/signin.mapper";
import { UserExistsSpecify } from "@dal/users/exists.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SignInRequest as Request } from "../schemas/signin.schema";
import type { SignInPayload as Payload } from "../schemas/signin.schema";

export class SignInHandler implements Handler<Request, Payload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Payload> {
    const existsQuery = new UserExistsSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (!exists) throw new Error("User not found");

    const isValid = await this.verify(request, exists.password);
    if (!isValid) throw new Error("Invalid password");

    return SignInMapper.toResponse(exists);
  };

  private async verify(request: Request, hashed: string): Promise<boolean> {
    return await Bun.password.verify(request.body.password, hashed);
  };
};
