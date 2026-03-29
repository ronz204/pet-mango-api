import { PrismaClient } from "@prisma/client";
import { LoginMapper } from "../mapping/login.mapper";
import { SearchUserSpecify } from "@features/users/prisma/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { LoginRequest } from "../schemas/login.schema";
import type { LoginPayload } from "../schemas/login.schema";

export class LoginHandler implements Handler<LoginRequest, LoginPayload> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: LoginRequest): Promise<LoginPayload> {
    const existsQuery = new SearchUserSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (!exists) throw new Error("User not found");

    const isValid = await this.verify(request, exists.password);
    if (!isValid) throw new Error("Invalid password");

    return LoginMapper.toResponse(exists);
  };

  private async verify(request: LoginRequest, hashed: string): Promise<boolean> {
    return await Bun.password.verify(request.body.password, hashed);
  };
};
