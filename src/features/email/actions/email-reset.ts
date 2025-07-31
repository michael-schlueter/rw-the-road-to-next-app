"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { hashToken } from "@/utils/crypto";
import { setCookieByKey } from "@/actions/cookies";
import { redirect } from "next/navigation";
import { emailVerificationPath } from "@/paths";
import { generateEmailVerificationCode } from "@/features/auth/utils/generate-email-verification-code";
import sendEmailVerification from "@/features/auth/emails/send-email-verification";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import * as authData from "@/features/auth/data";
import * as emailData from "@/features/email/data";

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
    const existingUserWithEmail = await authData.findUserByEmail(email);

    if (existingUserWithEmail) {
      return toActionState("ERROR", "Email already in use");
    }

    // Manage Reset Token
    const tokenHash = hashToken(tokenId);

    const emailResetToken = await emailData.findResetToken(tokenHash);

    if (!emailResetToken || Date.now() > emailResetToken.expiresAt.getTime()) {
      return toActionState(
        "ERROR",
        "Expired or invalid verification token",
        formData
      );
    }

    if (emailResetToken) {
      await emailData.deleteResetToken(tokenHash);
    }

    // Add new Email to DB
    await emailData.addNewEmail(user.id, email);

    const verificationCode = await generateEmailVerificationCode(
      user.id,
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
  redirect(emailVerificationPath());
}
