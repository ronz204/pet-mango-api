import { PrismaClient } from "@prisma/client";
import { PendingInvitesMapper } from "../mapping/pending.mapper";
import { PendingInvitesSpecify } from "@dal/invites/pending.specify";

import type { Handler } from "@contracts/handler.contract";
import type { PendingInvitesRequest as Request } from "../schemas/pending.schema";
import type { PendingInvitesResponse as Response } from "../schemas/pending.schema";

export class PendingInvitesHandler implements Handler<Request, Response> {
  constructor(private readonly prisma: PrismaClient) {}

  public async handle(request: Request): Promise<Response> {
    const pendingQuery = new PendingInvitesSpecify({
      userId: request.user,
    }).toQuery();

    const invitations = await this.prisma.invitation.findMany(pendingQuery);
    return PendingInvitesMapper.toResponse({ data: invitations });
  }
};
