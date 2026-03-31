import { Specify } from "@contracts/specify.contract";
import type { RoomFindFirstArgs } from "@prisma/models";

interface SpecifyArgs {
  roomId: number;
};

export class DetailsRoomSpecify extends Specify {
  constructor(private readonly args: SpecifyArgs) {super()};

  public override toQuery() {
    return {
      where: { id: this.args.roomId },
      include: {
        members: {
          include: {
            user: true
          },
        },
      },
    } as const satisfies RoomFindFirstArgs;
  };
};
