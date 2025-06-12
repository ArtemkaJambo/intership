import Redis from "ioredis";

const isDocker = process.env.NODE_ENV

export const redis = new Redis({
  host:'localhost',
  // host: process.env.redisHOST,
  port: Number(process.env.redisPORT)
});
