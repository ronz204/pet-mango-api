import type { MessageDto } from "@models/message.dto"

export interface IMessageCache {
  getter(args: GetterArgs): Promise<MessageDto[]>;
  dropper(args: DropperArgs): Promise<void>;
  setter(args: SetterArgs): Promise<void>;
};

export interface GetterArgs {
  roomId: number;
  limit: number;
  offset: number;
};

export interface SetterArgs {
  roomId: number;
  messages: MessageDto[];
};

export interface DropperArgs {
  roomId: number;
};
