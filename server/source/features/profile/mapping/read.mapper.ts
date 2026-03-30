import type { User } from "@prisma/client";
import type { ReadProfileResponse } from "../schemas/read.schema";

export class ReadProfileMapper {
  public static toResponse(user: User): ReadProfileResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
