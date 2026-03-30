import { Specify } from "@contracts/specify.contract";
import type { UserFindFirstArgs } from "@prisma/models";

interface SpecifyArgs {
  id: number;
  name?: string;
};

export class SearchUsersSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        name: this.args.name,
        id: { not: this.args.id },
      },
    } as const satisfies UserFindFirstArgs;
  };
};
