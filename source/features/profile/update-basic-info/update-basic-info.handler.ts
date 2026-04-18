import type { IUserDao } from "@dal/users/user.idao";
import type { UpdateBasicInfoRequest } from "./update-basic-info.schema";
import type { UpdateBasicInfoResponse } from "./update-basic-info.schema";

type Request = UpdateBasicInfoRequest;
type Response = UpdateBasicInfoResponse;

import { NotFoundError } from "@errors/barrep.error";

export class UpdateBasicInfoHandler {
  constructor(private dao: IUserDao) {};

  public async handle({ body, userId }: Request): Promise<Response> {
    const exists = await this.dao.obtain({ id: userId });
    if (!exists) throw new NotFoundError("User not found");

    const updated = await this.dao.update({ userId, ...body });
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
    };
  };
};
