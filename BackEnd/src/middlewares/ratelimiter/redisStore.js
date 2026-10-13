import { RedisStore } from "rate-limit-redis";
import { redisConnection } from "../../common/redis.js";

export function createRedisStore(prefix) {
    return new RedisStore({
        prefix,

        sendCommand: (command, ...args) =>
            redisConnection.call(command, ...args),
    });
}