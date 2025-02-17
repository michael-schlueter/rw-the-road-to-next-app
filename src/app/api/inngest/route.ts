import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetFunction } from "@/features/password/events/event-password-reset";
import { emailVerificationFunction } from "@/features/auth/events/event-email-verification";
import { emailSignUpFunction } from "@/features/auth/events/event-email-signup";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationFunction,
    emailSignUpFunction,
  ],
});
