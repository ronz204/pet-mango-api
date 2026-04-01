import type { Invitation } from "@prisma/client";
import type { SendInviteResponse } from "../schemas/send.schema";

export class SendInviteMapper {
  public static toResponse(data: Invitation): SendInviteResponse {
    return {
      id: data.id,
      roomId: data.roomId,
      inviteeId: data.inviteeId,
      createdAt: data.createdAt,
    } as const;
  }
}
