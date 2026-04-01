import type { UserUpdateArgs } from "@prisma/models";
import { Specify } from "@contracts/specify.contract";

interface SpecifyArgs {
  id: number;
  name?: string;
  password?: string;
};

export class UpdateUserSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where :{
        id: this.args.id,
      },
      data: {
        name: this.args.name,
        password: this.args.password,
      },
    } as const satisfies UserUpdateArgs;
  };
};
