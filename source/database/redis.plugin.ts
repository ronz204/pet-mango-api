import { env } from "@env";
import { Elysia } from "elysia";
import { RedisClient } from "bun";

const name: string = "redis.plugin";
const url = env.REDIS_URL;

export const RedisPlugin = new Elysia({ name })
  .decorate("redis", new RedisClient(url));
