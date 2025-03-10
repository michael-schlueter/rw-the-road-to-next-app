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
import { generateRandomToken } from "@/utils/crypto";
import { setSessionCookie } from "../utils/session-cookie";
import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";
import { setCookieByKey } from "@/actions/cookies";
import { validateEmailVerificationCode } from "../utils/validate-email-verification-code";

const emailVerificationSchema = z.object({
  code: z.string().length(8),
});

export async function emailVerification(
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAuthOrRedirect({
    checkEmailVerified: false,
    checkOrganization: true,
  });

  try {
    const { code } = emailVerificationSchema.parse({
      code: formData.get("code"),
    });

    // Check if this is an email change verification
    const emailToVerify = user.newEmail || user.email;

    const validCode = await validateEmailVerificationCode(
      user.id,
      emailToVerify,
      code
    );

    if (!validCode) {
      return toActionState("ERROR", "Invalid or expired code");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        newEmail: null, // Clear the pending email
        email: emailToVerify,
      },
    });

    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const sessionToken = generateRandomToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey(
    "toast",
    user.newEmail ? "Email changed successfully" : "Email verified"
  );
  redirect(ticketsPath());
}
