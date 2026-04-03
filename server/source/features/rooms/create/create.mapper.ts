import type { Room } from "@prisma/client";
import type { CreateResponse } from "./create.schema";

export class CreateMapper {
  public static toResponse(data: Room): CreateResponse {
    return {
      id: data.id,
      name: data.name,
    } as const;
  };
};
