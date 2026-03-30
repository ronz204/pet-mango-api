import type { User } from "@prisma/client";
import type { UpdateProfileResponse } from "../schemas/update.schema";

export class UpdateProfileMapper {
  public static toResponse(user: User): UpdateProfileResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
