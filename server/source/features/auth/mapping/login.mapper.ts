import type { User } from "@prisma/client";
import type { LoginPayload } from "../schemas/login.schema";

export class LoginMapper {
  public static toResponse(data: User): LoginPayload {
    return { id: data.id };
  };
};
