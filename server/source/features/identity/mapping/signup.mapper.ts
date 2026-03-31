import type { User } from "@prisma/client";
import type { SignUpPayload } from "../schemas/signup.schema";

export class SignUpMapper {
  public static toResponse(data: User): SignUpPayload {
    return { id: data.id };
  };
};
