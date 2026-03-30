import { Specify } from "@contracts/specify.contract";
import type { UserFindFirstArgs } from "@prisma/models";

interface SpecifyArgs {
  id: number;
};

export class ExtractUserSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        id: this.args.id,
      },
    } as const satisfies UserFindFirstArgs;
  };
};
