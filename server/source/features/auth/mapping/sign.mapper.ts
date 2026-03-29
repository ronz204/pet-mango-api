import type { User } from "@prisma/client";
import type { SignInOutput } from "../schemas/sign.schema";

export class SignInMapper {
  public static toOutput(data: User): SignInOutput {
    return { user: data.id };
  };
};
