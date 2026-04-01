import { PrismaClient } from "@prisma/client";
import { ProfileUserMapper } from "../mapping/profile.mapper";

import type { Handler } from "@contracts/handler.contract";
import type { ProfileUserRequest as Request } from "../schemas/profile.schema";
import type { ProfileUserResponse as Reseponse } from "../schemas/profile.schema";


export class ProfileUserHandler implements Handler<Request, Reseponse> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Reseponse> {
    const profile = await this.prisma.user.findFirst({
      where: { id: request.user }});

    if (!profile) throw new Error("User not found");
    return ProfileUserMapper.toResponse(profile);
  };
};
