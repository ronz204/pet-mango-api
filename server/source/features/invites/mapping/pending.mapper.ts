import type { InvitationGetPayload } from "@prisma/models";
import { PendingInvitesSpecify } from "@dal/invites/pending.specify";
import type { PendingInvitesResponse } from "../schemas/pending.schema";

type PendingInvitesQuery = ReturnType<PendingInvitesSpecify["toQuery"]>;

interface MapperArgs {
  data: InvitationGetPayload<PendingInvitesQuery>[];
}

export class PendingInvitesMapper {
  public static toResponse({ data }: MapperArgs): PendingInvitesResponse {
    return {
      invitations: data.map((invitation) => ({
        id: invitation.id,
        roomId: invitation.roomId,
        roomName: invitation.room.name,
        createdAt: invitation.createdAt,
      })),
    } as const;
  };
};
