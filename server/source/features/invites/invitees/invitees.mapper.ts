import { InviteesResponse } from "./invitees.schema";
import { RoomRepository } from "@repos/rooms/room.repo";

type InviteesQueryResult = ReturnType<RoomRepository["invitees"]>;

interface MapperArgs {
  data: Awaited<InviteesQueryResult>;
};

export class InviteesMapper {
  public static toResponse({ data }: MapperArgs): InviteesResponse {
    return {
      users: data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    };
  };
};
