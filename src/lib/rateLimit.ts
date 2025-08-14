import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const cache = new Map();

// Stricter rate limiter for sign-in attempts
export const signInRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "2m"),
  ephemeralCache: cache,
  prefix: "@upstash/ratelimit/sign-in",
  analytics: true,
});

// General rate limiter for other actions like password reset
export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(20, "10m"),
  ephemeralCache: cache,
  prefix: "@upstash/ratelimit/general",
  analytics: true,
});
