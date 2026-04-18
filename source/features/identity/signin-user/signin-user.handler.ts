import type { IUserDao } from "@dal/users/user.idao";
import type { SignInUserRequest } from "./signin-user.schema";
import type { SignInUserPayload } from "./signin-user.schema";

type Request = SignInUserRequest;
type Payload = SignInUserPayload;

import { AuthMapper } from "@auth/auth.mapper";
import { NotFoundError, ConflictError } from "@errors/barrep.error";

export class SignInUserHandler {
  constructor(private dao: IUserDao) {};

  public async handle(req: Request): Promise<Payload> {
    const exists = await this.dao.obtain(req.body);
    if (!exists) throw new NotFoundError("User not found");

    const isValid = await this.verify(req, exists.password);
    if (!isValid) throw new ConflictError("Invalid password");

    return AuthMapper.toResponse(exists);
  };

  private async verify(req: Request, hashed: string): Promise<boolean> {
    return await Bun.password.verify(req.body.password, hashed);
  };
};
