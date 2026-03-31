import { PrismaClient } from "@prisma/client";
import { UpdateUserMapper } from "../mapping/update.mapper";
import { UpdateUserSpecify } from "@dal/users/update.specify";

import type { Handler } from "@contracts/handler.contract";
import type { UpdateUserRequest as Request } from "../schemas/update.schema";
import type { UpdateUserResponse as Response } from "../schemas/update.schema";

export class UpdateUserHandler implements Handler<Request, Response> {
  constructor(private readonly prisma: PrismaClient) {};

  public async handle(request: Request): Promise<Response> {
    const updateQuery = new UpdateUserSpecify({
      ...request.body, id: request.user
    }).toQuery();

    const user = await this.prisma.user.update(updateQuery);
    return UpdateUserMapper.toResponse(user);
  };
};
