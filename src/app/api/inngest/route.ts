import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetFunction } from "@/features/password/events/event-password-reset";
import { emailVerificationFunction } from "@/features/auth/events/event-email-verification";
import { emailSignUpFunction } from "@/features/auth/events/event-email-signup";
import { emailTicketCountFunction } from "@/features/admin/events/event-email-ticketcount";
import { emailResetFunction } from "@/features/email/events/event-email-reset";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationFunction,
    emailSignUpFunction,
    emailTicketCountFunction,
    emailResetFunction,
  ],
});
