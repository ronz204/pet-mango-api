import { InvitationStatus } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { InvitationFindManyArgs } from "@prisma/models";

interface SpecifyArgs {
  userId: number;
};

export class PendingInvitesSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};
  
  public override toQuery() {
    return {
      where: {
        inviteeId: this.args.userId,
        status: InvitationStatus.PENDING,
      },
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
    } as const satisfies InvitationFindManyArgs;
  };
};
