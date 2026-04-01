import { InvitationStatus } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { InvitationCountArgs } from "@prisma/models";

interface SpecifyArgs {
  roomId: number;
  inviteeId: number;
};

export class InviteExistsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        roomId: this.args.roomId,
        inviteeId: this.args.inviteeId,
        status: InvitationStatus.PENDING,
      },
    } as const satisfies InvitationCountArgs;
  };
};
