import { Specify } from "@contracts/specify.contract";
import type { RoomCountArgs } from "@prisma/models";

export interface SpecifyArgs {
  id?: number;
  name?: string;
};

export class RoomExistsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        id: this.args.id,
        name: this.args.name,
      },
    } as const satisfies RoomCountArgs;
  };
};
