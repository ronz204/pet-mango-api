import type { RoomGetPayload } from "@prisma/models";
import { DetailsRoomSpecify } from "@dal/rooms/details.specify";
import type { DetailsRoomResponse } from "../schemas/details.schema";

type DetailsRoomQuery = ReturnType<DetailsRoomSpecify["toQuery"]>;

interface MapperArgs {
  data: RoomGetPayload<DetailsRoomQuery>;
};

export class DetailsRoomMapper {
  public static toResponse({ data }: MapperArgs): DetailsRoomResponse {
    return {
      id: data.id,
      name: data.name,
      members: data.members.map(member => ({
        id: member.id,
        userId: member.userId,
        name: member.user.name,
      })),
    };
  };
};
