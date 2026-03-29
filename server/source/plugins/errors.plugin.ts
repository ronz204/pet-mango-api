import { Elysia } from "elysia";
import { MangoError } from "@contracts/errors.contract";
import { ConflictError } from "@shared/errors/conflict.error";

export const ErrorsPlugin = new Elysia()
  .error({
    ConflictError,
  })
  
  .onError(({ error }) => {

  });
