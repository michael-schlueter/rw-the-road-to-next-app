import { AttachmentDeleteEventArgs } from "@/features/attachments/events/event-attachment-deleted";
import { EmailVerificationEventArgs } from "@/features/auth/events/event-email-verification";
import { EmailResetEventArgs } from "@/features/email/events/event-email-reset";
import { InvitationCreateEventArgs } from "@/features/invitations/events/event-invitation-created";
import { OrganizationDeleteEventArgs } from "@/features/organization/events/event-organization-deleted";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";
import { TickettDeleteEventArgs } from "@/features/ticket/events/event-ticket-deleted";
import { EventSchemas, Inngest } from "inngest";

type Events = {
  "app/password.password-reset": PasswordResetEventArgs;
  "app/auth.sign-up": EmailVerificationEventArgs;
  "app/email.email-reset": EmailResetEventArgs;
  "app/invitation.created": InvitationCreateEventArgs;
  "app/attachment.deleted": AttachmentDeleteEventArgs;
  "app/ticket.deleted": TickettDeleteEventArgs;
  "app/organization.deleted": OrganizationDeleteEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
