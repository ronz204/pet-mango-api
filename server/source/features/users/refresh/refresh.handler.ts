import { RefreshMapper } from "./refresh.mapper";
import { UserRepository } from "@repos/users/user.repo";

import type { RefreshRequest } from "./refresh.schema";
import type { RefreshResponse } from "./refresh.schema";

export class RefreshHandler  {
  constructor(private repo: UserRepository) {};

  public async handle(request: RefreshRequest): Promise<RefreshResponse> {
    const user = await this.repo.exists({ id: request.userId });
    if (!user) throw new Error("User not found");

    const updated = await this.repo.update({
      userId: request.userId, data: request.body
    });

    return RefreshMapper.toResponse(updated);
  };
};
