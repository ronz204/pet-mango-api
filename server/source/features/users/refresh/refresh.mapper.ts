import type { User } from "@prisma/client";
import { RefreshResponse } from "./refresh.schema";

export class RefreshMapper {
  public static toResponse(user: User): RefreshResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  };
};
