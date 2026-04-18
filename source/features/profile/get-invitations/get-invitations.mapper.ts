import { Search } from "@dal/invitations/queries/search.query";
import type { GetMyInvitationsResponse } from "./get-invitations.schema";

export class GetMyInvitationsMapper {
  public static toSearchQuery(data: Search.Result[]): GetMyInvitationsResponse {
    return {
      invitations: data.map((invite) => ({
        id: invite.id,
        status: invite.status,
        roomId: invite.roomId,
        roomName: invite.room.name,
      })),
    };
  };
};
