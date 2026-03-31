import type { RoomGetPayload } from "@prisma/models";
import { SearchRoomsSpecify } from "@dal/rooms/search.specify";
import type { SearchRoomsResponse } from "../schemas/search.schema";

type SearchRoomsQuery = ReturnType<SearchRoomsSpecify["toQuery"]>;

interface MapperArgs {
  data: RoomGetPayload<SearchRoomsQuery>[];
};

export class SearchRoomsMapper {
  public static toResponse({ data }: MapperArgs): SearchRoomsResponse {
    return {
      rooms: data.map((room) => ({
        id: room.id,
        name: room.name,
        members: room._count.members,
      })),
    };
  };
};
