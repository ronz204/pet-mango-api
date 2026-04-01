import { Specify } from "@contracts/specify.contract";
import type { InvitationCreateArgs } from "@prisma/models";

interface SpecifyArgs {
  roomId: number;
  inviteeId: number;
};

export class SendInviteSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};
  
  public override toQuery() {
    return {
      data: {
        roomId: this.args.roomId,
        inviteeId: this.args.inviteeId,
      },
    } as const satisfies InvitationCreateArgs;
  };
};
