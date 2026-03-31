import type { Member } from "@prisma/client";
import type { JoinRoomResponse } from "../schemas/join.schema";

export class JoinRoomMapper {
  public static toResponse(data: Member): JoinRoomResponse {
    return {
      id: data.id,
      roomId: data.roomId,
      userId: data.userId,
      role: data.role,
    } as const;
  };
};
