import { LeaveResponse } from "./leave.schema";

export class LeaveMapper {
  public static toResponse(): LeaveResponse {
    return {
      success: true,
      message: "Successfully left the room",
    } as const;
  };
};
