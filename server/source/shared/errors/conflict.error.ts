import type { ErrorArgs } from "@contracts/errors.contract";
import { MangoError } from "@contracts/errors.contract";

export class ConflictError extends MangoError {
  constructor(args: ErrorArgs) {
    super(409, args);
  };
};
