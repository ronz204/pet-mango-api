import type { Invitation } from "@prisma/client";
import type { SendResponse } from "./send.schema";

export class SendMapper {
  public static toResponse(data: Invitation): SendResponse {
    return {
      id: data.id,
      roomId: data.roomId,
      inviteeId: data.inviteeId,
    } as const;
  };
};
