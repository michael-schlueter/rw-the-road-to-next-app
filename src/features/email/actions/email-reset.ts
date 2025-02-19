"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/utils/crypto";
import { setCookieByKey } from "@/actions/cookies";
import { redirect } from "next/navigation";
import { signInPath } from "@/paths";
import { generateEmailVerificationCode } from "@/features/auth/utils/generate-email-verification-code";
import sendEmailVerification from "@/features/auth/emails/send-email-verification";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";

const emailResetSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
});

export async function emailReset(
  tokenId: string,
  _actionState: ActionState,
  formData: FormData
) {
  try {
    const { user } = await getAuthOrRedirect();

    const { email } = emailResetSchema.parse({
      email: formData.get("email"),
    });

    // Check if email is already in use
    const existingUserWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUserWithEmail) {
      return toActionState("ERROR", "Email already in use");
    }

    // Manage Reset Token
    const tokenHash = hashToken(tokenId);

    const emailResetToken = await prisma.emailResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (emailResetToken) {
      await prisma.emailResetToken.delete({
        where: {
          tokenHash,
        },
      });
    }

    if (!emailResetToken || Date.now() > emailResetToken.expiresAt.getTime()) {
      return toActionState(
        "ERROR",
        "Expired or invalid verification token",
        formData
      );
    }

    // Add new Email to DB
    await prisma.user.update({
      where: {
        id: emailResetToken.userId,
      },
      data: {
        newEmail: email,
        emailVerified: false,
      },
    });

    const verificationCode = await generateEmailVerificationCode(
      emailResetToken.userId,
      email
    );

    const result = await sendEmailVerification(
      user.username,
      email,
      verificationCode
    );

    if (result.error) {
      return toActionState("ERROR", "Failed to send verification email");
    }
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Verification code sent to new email address");
  redirect(signInPath());
}
