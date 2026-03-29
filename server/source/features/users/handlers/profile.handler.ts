import { PrismaClient } from "@prisma/client";
import { ProfileMapper } from "../mapping/profile.mapper";
import { SearchUserSpecify } from "../prisma/search.specify";

import type { Handler } from "@contracts/handler.contract";
import type { ProfileRequest } from "../schemas/profile.schema";
import type { ProfileResponse } from "../schemas/profile.schema";

export class ProfileHandler implements Handler<ProfileRequest, ProfileResponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: ProfileRequest): Promise<ProfileResponse> {
    const searchQuery = new SearchUserSpecify({ id: 2 }).toQuery();

    const profile = await this.prisma.user.findFirst(searchQuery);
    if (!profile) throw new Error("User not found");

    return ProfileMapper.toResponse(profile);
  };
};
