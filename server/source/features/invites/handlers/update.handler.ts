import { PrismaClient } from "@prisma/client";
import { InvitationStatus } from "@prisma/enums";
import { UpdateInviteMapper } from "../mapping/update.mapper";
import { CreateMemberSpecify } from "@dal/member/create.specify";
import { UpdateInviteSpecify } from "@dal/invites/update.specify";

import type { Handler } from "@contracts/handler.contract";
import type { UpdateInviteRequest as Request } from "../schemas/update.schema";
import type { UpdateInviteResponse as Response } from "../schemas/update.schema";

export class UpdateInviteHandler implements Handler<Request, Response> {
  constructor(private readonly prisma: PrismaClient) {}

  public async handle(request: Request): Promise<Response> {
    const { id } = request.params;
    const { status } = request.body;

    const invitation = await this.prisma.invitation.findUnique({ where: { id } });
    if (!invitation) throw new Error("Invitation not found");

    if (invitation.inviteeId !== request.user) {
      throw new Error("You can only update your own invitations");
    };

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new Error("Invitation is not pending");
    };

    const updateQuery = new UpdateInviteSpecify({ invitationId: id, status }).toQuery();
    const updated = await this.prisma.invitation.update(updateQuery);

    if (status === InvitationStatus.ACCEPTED) {
      const createMemberQuery = new CreateMemberSpecify({
        userId: request.user, roomId: invitation.roomId }).toQuery();

      await this.prisma.member.create(createMemberQuery);
    };

    return UpdateInviteMapper.toResponse(updated);
  };
};
