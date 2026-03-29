import { PrismaClient } from "@prisma/client";
import { ReadMapper } from "../mapping/read.mapper";
import { SearchUserSpecify } from "@repos/users/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { ReadRequest } from "../schemas/read.schema";
import type { ReadResponse } from "../schemas/read.schema";

export class ReadHandler implements Handler<ReadRequest, ReadResponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: ReadRequest): Promise<ReadResponse> {
    const searchQuery = new SearchUserSpecify({ id: request.id }).toQuery();

    const profile = await this.prisma.user.findFirst(searchQuery);
    if (!profile) throw new Error("User not found");

    return ReadMapper.toResponse(profile);
  };
};
