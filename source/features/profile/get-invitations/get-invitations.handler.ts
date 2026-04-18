import type { IInviteDao } from "@dal/invitations/invite.idao";
import type { GetMyInvitationsRequest } from "./get-invitations.schema";
import type { GetMyInvitationsResponse } from "./get-invitations.schema";

type Request = GetMyInvitationsRequest;
type Response = GetMyInvitationsResponse;

import { InvitationStatus } from "@prisma/enums";
import { GetMyInvitationsMapper } from "./get-invitations.mapper";

export class GetMyInvitationsHandler {
  constructor(private inviteDao: IInviteDao) {};

  public async handle({ userId }: Request): Promise<Response> {
    const invitations = await this.inviteDao.search({
      inviteeId: userId, status: InvitationStatus.PENDING
    });

    return GetMyInvitationsMapper.toSearchQuery(invitations);
  };
};
