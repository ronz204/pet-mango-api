import { InvitationStatus } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { InvitationUpdateArgs } from "@prisma/models";

interface SpecifyArgs {
  invitationId: number;
  status: InvitationStatus;
};

export class UpdateInviteSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        id: this.args.invitationId,
      },
      data: {
        status: this.args.status,
      },
    } as const satisfies InvitationUpdateArgs;
  };
};
