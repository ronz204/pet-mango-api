import { Specify } from "@contracts/specify.contract";
import type { UserFindFirstArgs } from "@prisma/models";

interface SpecifyArgs {
  id?: number;
  code?: string;
  email?: string;
};

export class SearchUserSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        id: this.args.id,
        code: this.args.code,
        email: this.args.email,
      },
    } as const satisfies UserFindFirstArgs;
  };
};
