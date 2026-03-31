import { Specify } from "@contracts/specify.contract";
import type { MemberDeleteArgs } from "@prisma/models";

interface SpecifyArgs {
  userId: number;
  roomId: number;
};

export class DeleteMemberSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        userId_roomId: {
          userId: this.args.userId,
          roomId: this.args.roomId,
        },
      },
    } as const satisfies MemberDeleteArgs;
  };
};
