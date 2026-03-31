import type { User } from "@prisma/client";
import type { UpdateUserResponse } from "../schemas/update.schema";

export class UpdateUserMapper {
  public static toResponse(user: User): UpdateUserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
