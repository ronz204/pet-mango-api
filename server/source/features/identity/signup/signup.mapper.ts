import type { User } from "@prisma/client";
import type { SignUpPayload } from "./signup.schema";

export class SignUpMapper {
  public static toResponse(data: User): SignUpPayload {
    return { userId: data.id };
  };
};
