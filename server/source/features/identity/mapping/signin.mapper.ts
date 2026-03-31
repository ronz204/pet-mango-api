import type { User } from "@prisma/client";
import { SignInPayload } from "../schemas/signin.schema";

export class SignInMapper {
  public static toResponse(data: User): SignInPayload {
    return { id: data.id };
  };
};
