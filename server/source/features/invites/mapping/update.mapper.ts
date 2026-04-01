import type { Invitation } from "@prisma/client";
import type { UpdateInviteResponse } from "../schemas/update.schema";

export class UpdateInviteMapper {
  public static toResponse(data: Invitation): UpdateInviteResponse {
    return {
      id: data.id,
      status: data.status,
      roomId: data.roomId,
    } as const;
  };
};
