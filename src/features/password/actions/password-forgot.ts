"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { inngest } from "@/lib/inngest";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import * as authData from "@/features/auth/data";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(20, "10m"),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

const passwordForgotSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function passwordForgot(
  _actionState: ActionState,
  formData: FormData
) {
  try {
    // Rate limiting check
    const headersList = headers();
    const ip = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    const { email } = passwordForgotSchema.parse({
      email: formData.get("email"),
    });

    if (!success) {
      return toActionState(
        "ERROR",
        "Too many attempts to re-send password. Please try again later.",
        formData
      );
    }

    const user = await authData.findUserByEmail(email);

    if (!user) {
      return toActionState("SUCCESS", "Check your email for a reset link");
    }

    await inngest.send({
      name: "app/password.password-reset",
      data: {
        userId: user.id,
      },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  return toActionState("SUCCESS", "Check your email for a reset link");
}
