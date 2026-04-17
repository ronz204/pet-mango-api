import type { MessageFindManyArgs } from "@prisma/models";
import type { MessageGetPayload } from "@prisma/models";

export namespace ReadAll {
  export interface Args {
    roomId: number;
    limit?: number;
    offset?: number;
  };

  export function query(args: Args) {
    const take = args.limit ?? 100;
    const page = args.offset ?? 1;
    const skip = (page - 1) * take;

    return {
      where: {
        id: args.roomId,
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: take,
      skip: skip,
    } satisfies MessageFindManyArgs;
  };

  export type Result = MessageGetPayload<ReturnType<typeof query>>;
};
