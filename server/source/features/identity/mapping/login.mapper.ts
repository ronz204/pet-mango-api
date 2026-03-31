import type { User } from "@prisma/client";
import type { LoginUserPayload } from "../schemas/login.schema";

export class LoginUserMapper {
  public static toResponse(data: User): LoginUserPayload {
    return { id: data.id };
  };
};
