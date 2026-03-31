import { PrismaClient } from "@prisma/client";
import { ProfileUserMapper } from "../mapping/profile.mapper";
import { ExtractUserSpecify } from "@dal/users/extract.specify";

import type { Handler } from "@contracts/handler.contract";
import type { ProfileUserRequest as Request } from "../schemas/profile.schema";
import type { ProfileUserResponse as Reseponse } from "../schemas/profile.schema";


export class ProfileUserHandler implements Handler<Request, Reseponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Reseponse> {
    const extractQuery = new ExtractUserSpecify({ id: request.id }).toQuery();

    const profile = await this.prisma.user.findFirst(extractQuery);
    if (!profile) throw new Error("User not found");

    return ProfileUserMapper.toResponse(profile);
  };
};
