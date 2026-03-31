import type { Room } from "@prisma/client";
import type { CreateRoomResponse } from "../schemas/create.schema";

export class CreateRoomMapper {
  public static toResponse(data: Room): CreateRoomResponse {
    return {
      id: data.id,
      name: data.name,
    } as const;
  };
};
