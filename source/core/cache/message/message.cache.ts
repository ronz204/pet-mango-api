import type { RedisClient } from "bun";
import type { MessageDto } from "@database/models/message.dto";
import type { IMessageCache, DropperArgs, GetterArgs, SetterArgs } from "./message.icache";

export class MessageCache implements IMessageCache {
  private readonly CACHE_TTL = 300;
  private readonly CACHE_MAX = 100;

  private readonly PREFIX = "room";

  constructor(private redis: RedisClient) {};

  private getKey(roomId: number): string {
    return `${this.PREFIX}:${roomId}:messages`;
  };

  public async getter(args: GetterArgs): Promise<MessageDto[]> {
    const { roomId, limit, offset } = args;
    if (offset !== 0) return [];

    const key = this.getKey(roomId);
    const end = Math.min(limit, this.CACHE_MAX) - 1;
    const cached = await this.redis.lrange(key, 0, end);

    if (!cached || cached.length === 0) return [];
    return cached.map((item) => JSON.parse(item));
  };

  public async setter(args: SetterArgs): Promise<void> {
    const { roomId, messages } = args;
    if (messages.length === 0) return;

    const key = this.getKey(roomId);
    await this.redis.del(key);

    const serialized = messages.map(msg => JSON.stringify(msg));
    await this.redis.rpush(key, ...serialized as [string, ...string[]]);

    await Promise.all([
      this.redis.ltrim(key, -this.CACHE_MAX, -1),
      this.redis.expire(key, this.CACHE_TTL),
    ]);
  };

  public async dropper(args: DropperArgs): Promise<void> {
    const key = this.getKey(args.roomId);
    await this.redis.del(key);
  };
};
