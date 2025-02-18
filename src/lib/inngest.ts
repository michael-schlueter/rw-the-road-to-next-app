import { EmailVerificationEventArgs } from "@/features/auth/events/event-email-verification";
import { EmailResetEventArgs } from "@/features/email/events/event-email-reset";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";
import { EventSchemas, Inngest } from "inngest";

type Events = {
  "app/password.password-reset": PasswordResetEventArgs;
  "app/auth.sign-up": EmailVerificationEventArgs;
  "app/email.email-reset": EmailResetEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
