import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { passwordResetFunction } from "@/features/password/events/event-password-reset";
import { emailVerificationFunction } from "@/features/auth/events/event-email-verification";
import { emailWelcomeFunction } from "@/features/auth/events/event-email-welcome";
import { emailTicketCountFunction } from "@/features/admin/events/event-email-ticketcount";
import { emailResetFunction } from "@/features/email/events/event-email-reset";
import { invitationCreatedEvent } from "@/features/invitations/events/event-invitation-created";
import { invitationProcessingEvent } from "@/features/invitations/events/event-invitation-processing";
import { attachmentDeletedEvent } from "@/features/attachments/events/event-attachment-deleted";
import { ticketDeletedEvent } from "@/features/ticket/events/event-ticket-deleted";
import { organizationDeletedEvent } from "@/features/organization/events/event-organization-deleted";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    passwordResetFunction,
    emailVerificationFunction,
    emailWelcomeFunction,
    emailTicketCountFunction,
    emailResetFunction,
    invitationCreatedEvent,
    invitationProcessingEvent,
    attachmentDeletedEvent,
    ticketDeletedEvent,
    organizationDeletedEvent,
  ],
});
