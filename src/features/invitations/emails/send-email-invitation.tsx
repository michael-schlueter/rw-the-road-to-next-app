import EmailInvitation from "@/emails/invitation/email-invitation";
import { resend } from "@/lib/resend";
import React from "react";

export default async function sendEmailInvitation(
  username: string,
  organizationName: string,
  email: string,
  emailInvitationLink: string
) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: `Invitation to ${organizationName} from TicketBounty`,
    react: (
      <EmailInvitation
        fromUser={username}
        fromOrganization={organizationName}
        url={emailInvitationLink}
      />
    ),
  });
}
