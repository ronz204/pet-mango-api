import { MemberRole } from "@prisma/enums";
import { RoomVisibility } from "@prisma/enums";
import { Specify } from "@contracts/specify.contract";
import type { RoomCreateArgs } from "@prisma/models";

interface SpecifyArgs {
  name: string;
  userId: number;
  visibility: RoomVisibility;
};

export class CreateRoomSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      data: {
        name: this.args.name,
        visibility: this.args.visibility,
        members: {
          create: {
            userId: this.args.userId,
            role: MemberRole.ADMIN,
          },
        },
      },
    } as const satisfies RoomCreateArgs;
  };
};
