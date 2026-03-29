import type { User } from "@prisma/client";
import type { ProfileResponse } from "../schemas/profile.schema";

export class ProfileMapper {
  public static toResponse(user: User): ProfileResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
