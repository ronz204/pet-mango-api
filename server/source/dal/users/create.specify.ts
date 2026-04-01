import { Specify } from "@contracts/specify.contract";
import type { UserCreateArgs } from "@prisma/models";

interface SpecifyArgs {
  name: string;
  email: string;
  password: string;
};

export class CreateUserSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      data: {
        name: this.args.name,
        email: this.args.email,
        password: this.args.password,
      },
    } as const satisfies UserCreateArgs;
  };
};
