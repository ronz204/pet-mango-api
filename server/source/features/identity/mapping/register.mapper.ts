import type { User } from "@prisma/client";
import type { RegisterUserPayload } from "../schemas/register.schema";

export class RegisterUserMapper {
  public static toResponse(data: User): RegisterUserPayload {
    return { id: data.id };
  };
};
