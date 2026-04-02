import { SignUpMapper } from "./signup.mapper";
import { UserRepository } from "@repos/users/user.repo";

import type { SignUpRequest } from "./signup.schema";
import type { SignUpPayload } from "./signup.schema";

export class SignUpHandler {
  constructor(private repo: UserRepository) {};

  public async handle(request: SignUpRequest): Promise<SignUpPayload> {
    const exists = await this.repo.exists({ email: request.body.email });
    if (exists) throw new Error("User already exists");

     const created = await this.repo.create({ data: request.body });
     return SignUpMapper.toResponse(created);
  };

  private async verify(request: SignUpRequest, hashed: string): Promise<boolean> {
    return await Bun.password.verify(request.body.password, hashed);
  };
};
