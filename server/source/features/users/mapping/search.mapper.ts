import type { User } from "@prisma/client";
import type { SearchUsersResponse } from "../schemas/search.schema";

export class SearchUsersMapper {
  public static toResponse(users: User[]): SearchUsersResponse {
    return users.map(user => ({
      id: user.id,
      name: user.name,
    }));
  };
};
