
import IRedisService from "@/interfaces/cache/redis-cache-interface";
import Redis, { Redis as IORedisClient } from "ioredis";

export default class RedisService implements IRedisService {
  private redisClient: IORedisClient;
  private redisConnected: boolean = false;

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL || "");

    this.redisClient.on("connect", () => {
      console.log("Connected to Redis (ioredis) at:", new Date().toISOString());
    });

    this.redisClient.on("ready", () => {
      this.redisConnected = true;
      console.log("Redis is ready!");
    });

    this.redisClient.on("error", (err) => {
      this.redisConnected = false;
      console.error("Redis connection error:", err);
    });
  }

  public isRedisConnected(): boolean {
    return this.redisConnected;
  }

  public async setDataAsync(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
      console.error("Error setting Redis data:", error);
    }
  }

  public async getDataAsync(key: string): Promise<any> {
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting Redis data:", error);
      return null;
    }
  }

  public getClient(): IORedisClient {
    return this.redisClient;
  }
}
