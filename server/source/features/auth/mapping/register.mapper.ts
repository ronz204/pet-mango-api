import type { User } from "@prisma/client";
import type { RegisterOutput } from "../schemas/register.schema";

export class RegisterMapper {
  public static toOutput(data: User): RegisterOutput {
    return { user: data.id };
  };
};
