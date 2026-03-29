import type { User } from "@prisma/client";
import type { ReadResponse } from "../schemas/read.schema";

export class ReadMapper {
  public static toResponse(user: User): ReadResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
