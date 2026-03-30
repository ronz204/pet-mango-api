import type { UserUpdateArgs } from "@prisma/models";
import { Specify } from "@contracts/specify.contract";
import { ExtractUserSpecify } from "./extract.specify";

interface SpecifyArgs {
  id: number;
  name: string;
  password: string;
};

export class UpdateUserSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    const extract = new ExtractUserSpecify({ id: this.args.id });

    return {
      ...extract.toQuery(),
      data: {
        name: this.args.name,
        password: this.args.password,
      },
    } as const satisfies UserUpdateArgs;
  };
};
