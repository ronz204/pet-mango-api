import { Specify } from "@contracts/specify.contract";
import type { UserFindFirstArgs } from "@prisma/models";

interface SpecifyArgs {
  name?: string;
  email?: string;
};

export class UserExistsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        name: this.args.name,
        email: this.args.email,
      },
    } as const satisfies UserFindFirstArgs;
  };
};
