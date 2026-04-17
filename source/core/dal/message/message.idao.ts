import { ReadAll } from "./queries/readall.query";

export interface IMessageDao {
  read(args: ReadAll.Args): Promise<ReadAll.Result | null>;
};
