import { Specify } from "@contracts/specify.contract";
import type { MemberCountArgs } from "@prisma/models";

export interface SpecifyArgs {
  userId: number;
  roomId: number;
};

export class MemberExistsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        userId: this.args.userId,
        roomId: this.args.roomId,
      },
    } as const satisfies MemberCountArgs;
  };
};
