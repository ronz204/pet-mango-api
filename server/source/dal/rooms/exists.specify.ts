import { Specify } from "@contracts/specify.contract";
import type { RoomCountArgs } from "@prisma/models";

export interface SpecifyArgs {
  name?: string;
};

export class RoomExistsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        name: this.args.name,
      },
    } as const satisfies RoomCountArgs;
  };
};
