import { SetOptions } from "redis";

export default interface IRedisService {
    isRedisConnected(): boolean
}