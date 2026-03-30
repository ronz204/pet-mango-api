import { PrismaClient } from "@prisma/client";
import { ReadProfileMapper } from "../mapping/read.mapper";
import { ExtractUserSpecify } from "@dal/users/extract.specify";

import type { Handler } from "@contracts/handler.contract";
import type { ReadProfileRequest } from "../schemas/read.schema";
import type { ReadProfileResponse } from "../schemas/read.schema";

export class ReadProfileHandler implements Handler<ReadProfileRequest, ReadProfileResponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: ReadProfileRequest): Promise<ReadProfileResponse> {
    const extractQuery = new ExtractUserSpecify({ id: request.id }).toQuery();

    const profile = await this.prisma.user.findFirst(extractQuery);
    if (!profile) throw new Error("User not found");

    return ReadProfileMapper.toResponse(profile);
  };
};
