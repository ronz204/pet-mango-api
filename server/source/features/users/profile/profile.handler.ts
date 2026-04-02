import { ProfileMapper } from "./profile.mapper";
import { UserRepository } from "@repos/users/user.repo";

import type { ProfileRequest } from "./profile.schema";
import type { ProfileResponse } from "./profile.schema";

export class ProfileHandler {
  constructor(private repo: UserRepository) {};

  public async handle(request: ProfileRequest): Promise<ProfileResponse> {
    const user = await this.repo.exists({ id: request.userId });
    if (!user) throw new Error("User not found");
    return ProfileMapper.toResponse(user);
  };
};
