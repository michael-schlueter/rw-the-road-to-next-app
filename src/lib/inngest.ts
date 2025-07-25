import { AttachmentDeleteEventArgs } from "@/features/attachments/events/event-attachment-deleted";
import { EmailVerificationEventArgs } from "@/features/auth/events/event-email-verification";
import { EmailResetEventArgs } from "@/features/email/events/event-email-reset";
import { InvitationCreateEventArgs } from "@/features/invitations/events/event-invitation-created";
import { OrganizationCreateEventArgs } from "@/features/organization/events/event-organization-created";
import { OrganizationDeleteEventArgs } from "@/features/organization/events/event-organization-deleted";
import { PasswordResetEventArgs } from "@/features/password/events/event-password-reset";
import { OrganizationDeprovisionedEventArgs } from "@/features/stripe/events/event-organization-deprovisioned";
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
  "app/organization.created": OrganizationCreateEventArgs;
  "app/organization.deprovisioned": OrganizationDeprovisionedEventArgs;
};

export const inngest = new Inngest({
  id: "the-road-to-next",
  schemas: new EventSchemas().fromRecord<Events>(),
});
