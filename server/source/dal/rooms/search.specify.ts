import { RoomVisibility } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { RoomFindManyArgs } from "@prisma/models";
import type { MemberListRelationFilter } from "@prisma/models";

interface SpecifyArgs {
  name?: string;
  userId: number;
  isOwn: boolean;
  visibility?: RoomVisibility;
};

export class SearchRoomsSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    const membersFilter: MemberListRelationFilter = this.args.isOwn
      ? { some: { userId: this.args.userId } }
      : { none: { userId: this.args.userId } };

    return {
      where: {
        name: this.args.name,
        visibility: this.args.visibility,
        members: membersFilter,
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    } as const satisfies RoomFindManyArgs;
  };
};
