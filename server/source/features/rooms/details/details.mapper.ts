import { DetailsResponse } from "./details.schema";
import { RoomRepository } from "@repos/rooms/room.repo";

type DetailsQueryResult = ReturnType<RoomRepository["details"]>;

interface MapperArgs {
  data: NonNullable<Awaited<DetailsQueryResult>>;
};

export class DetailsMapper {
  public static toResponse({ data }: MapperArgs): DetailsResponse {
    return {
      id: data.id,
      name: data.name,
      members: data.members.map(member => ({
        id: member.id,
        userId: member.userId,
        userName: member.user.name,
      })),
      messages: data.messages.map(message => ({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender.name,
      })),
    };
  };
};
