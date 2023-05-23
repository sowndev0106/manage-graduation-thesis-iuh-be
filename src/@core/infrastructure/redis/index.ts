import { RedisClientType } from "@node-redis/client/dist/lib/client";
import { createClient } from "redis";

export default class RedisCache {
  private static _instance: RedisCache;
  private _client: RedisClientType<any>;

  private constructor() {
    this._client = createClient({
      url: process.env.REDIS_URL,
    });
    console.log({ REDIS_URL: process.env.REDIS_URL });

    this._client.on("connect", () => {
      console.log("Redis connected");
    });

    this._client.on("error", (err: any) => {
      console.log("Redis Error", err);
    });
  }

  public static async instance() {
    if (!RedisCache._instance) {
      RedisCache._instance = new RedisCache();
      await RedisCache._instance.connect();
    }

    return RedisCache._instance;
  }

  public async connect() {
    this._client.connect();
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this._client.setEx(key, ttl, value);
    } else {
      await this._client.set(key, value);
    }
  }

  async get(key: string) {
    return await this._client.get(key);
  }

  async delete(key: string) {
    await this._client.del(key);
  }
}
