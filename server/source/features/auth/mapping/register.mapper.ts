import type { User } from "@prisma/client";
import type { RegisterPayload } from "../schemas/register.schema";

export class RegisterMapper {
  public static toResponse(data: User): RegisterPayload {
    return { id: data.id };
  };
};
