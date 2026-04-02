import { SignInMapper } from "./signin.mapper";
import { UserRepository } from "@repos/users/user.repo";

import type { SignInRequest } from "./signin.schema";
import type { SignInPayload } from "./signin.schema";

export class SignInHandler {
  constructor(private repo: UserRepository) {};

  public async handle(request: SignInRequest): Promise<SignInPayload> {
    const exists = await this.repo.exists({ email: request.body.email });
    if (!exists) throw new Error("User not found");

    const isValid = await this.verify(request, exists.password);
    if (!isValid) throw new Error("Invalid password");

    return SignInMapper.toResponse(exists);
  };

  private async verify(request: SignInRequest, hashed: string): Promise<boolean> {
    return await Bun.password.verify(request.body.password, hashed);
  };
};
