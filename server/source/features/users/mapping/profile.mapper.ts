import type { User } from "@prisma/client";
import type { ProfileUserResponse } from "../schemas/profile.schema";

export class ProfileUserMapper {
  public static toResponse(user: User): ProfileUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
