import { RoomVisibility } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { RoomFindManyArgs } from "@prisma/models";

interface SpecifyArgs {
  name?: string;
  userId: number;
};

export class SearchRoomsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        name: this.args.name,
        visibility: RoomVisibility.PUBLIC,
        members: {
          none: { userId: this.args.userId },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    } as const satisfies RoomFindManyArgs;
  };
};
