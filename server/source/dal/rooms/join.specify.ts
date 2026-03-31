import { MemberRole } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { MemberCreateArgs } from "@prisma/models";

interface SpecifyArgs {
  userId: number;
  roomId: number;
};

export class JoinRoomSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      data: {
        userId: this.args.userId,
        roomId: this.args.roomId,
        role: MemberRole.USER,
      },
    } as const satisfies MemberCreateArgs;
  };
};
