"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { ticketsPath } from "@/paths";
import { verifyPasswordHash } from "@/features/password/utils/hash-and-verify";
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../utils/session-cookie";
import { headers } from "next/headers";
import { signInRateLimit } from "@/lib/rateLimit";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

export async function signIn(_actionState: ActionState, formData: FormData) {
  try {
    // Rate limiting check
    const headersList = headers();
    const ip = (await headersList).get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await signInRateLimit.limit(ip);

    if (!success) {
      return toActionState(
        "ERROR",
        "Too many sign-in attempts. Please try again later.",
        formData
      );
    }

    const { email, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const validPassword = await verifyPasswordHash(
      user ? user.passwordHash : "$argon",
      password
    );

    if (!user || !validPassword) {
      return toActionState("ERROR", "Incorrect email or password", formData);
    }

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  redirect(ticketsPath());
}