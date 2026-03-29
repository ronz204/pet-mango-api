import { PrismaClient } from "@prisma/client";
import { SignInMapper } from "../mapping/sign.mapper";
import { SearchUserSpecify } from "@features/users/prisma/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { SignInInput } from "../schemas/sign.schema";
import type { SignInOutput } from "../schemas/sign.schema";

export class SignInHandler implements Handler<SignInInput, SignInOutput> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: SignInInput): Promise<SignInOutput> {
    const existsQuery = new SearchUserSpecify(request.body).toQuery();

    const exists = await this.prisma.user.findFirst(existsQuery);
    if (!exists) throw new Error("User not found");

    return SignInMapper.toOutput(exists);
  };
};
