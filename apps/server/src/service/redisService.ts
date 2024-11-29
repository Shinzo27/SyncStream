import Redis, { createClient, RedisClientType } from 'redis'  

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
    console.log("Redis Client Ready");
});

redisClient.connect();

export default redisClient;