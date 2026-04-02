import type { User } from "@prisma/client";
import { SignInPayload } from "./signin.schema";

export class SignInMapper {
  public static toResponse(data: User): SignInPayload {
    return { userId: data.id };
  };
};
