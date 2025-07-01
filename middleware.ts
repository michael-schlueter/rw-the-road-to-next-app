import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, "10m"),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

export default async function middleware(
  request: NextRequest,
  context: NextFetchEvent
): Promise<Response | undefined> {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const { success, pending, limit, remaining } = await ratelimit.limit(ip);
  context.waitUntil(pending);

  const res = success
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/api/blocked", request.url));

  res.headers.set("X-RateLimit-Success", success.toString());
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());

  return res;
}

export const config = {
  matcher: "/api/",
};
