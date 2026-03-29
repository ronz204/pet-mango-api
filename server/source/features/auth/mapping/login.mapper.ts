import type { User } from "@prisma/client";
import type { LoginOutput } from "../schemas/login.schema";

export class LoginMapper {
  public static toOutput(data: User): LoginOutput {
    return { user: data.id };
  };
};
