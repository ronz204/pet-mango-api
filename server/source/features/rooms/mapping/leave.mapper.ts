import type { LeaveRoomResponse } from "../schemas/leave.schema";

export class LeaveRoomMapper {
  public static toResponse(): LeaveRoomResponse {
    return {
      success: true,
      message: "Successfully left the room",
    } as const;
  };
};
