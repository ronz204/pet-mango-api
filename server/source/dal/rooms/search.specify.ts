import { RoomVisibility } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { RoomFindManyArgs } from "@prisma/models";

interface SpecifyArgs {
  name?: string;
  userId: number;
  visibility?: RoomVisibility;
};

export class SearchRoomsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: {
        name: this.args.name,
        visibility: this.args.visibility,
        members: {
          some: { userId: this.args.userId },
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
