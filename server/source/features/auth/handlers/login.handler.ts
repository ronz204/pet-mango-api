import { PrismaClient } from "@prisma/client";
import { LoginMapper } from "../mapping/login.mapper";
import { SearchUserSpecify } from "@features/users/prisma/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { LoginInput } from "../schemas/login.schema";
import type { LoginOutput } from "../schemas/login.schema";

export class LoginHandler implements Handler<LoginInput, LoginOutput> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: LoginInput): Promise<LoginOutput> {
    const existsQuery = new SearchUserSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (!exists) throw new Error("User not found");

    return LoginMapper.toOutput(exists);
  };
};
