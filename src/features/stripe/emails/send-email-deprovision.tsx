import EmailDeprovision from "@/emails/admin/email-deprovision";
import { resend } from "@/lib/resend";
import React from "react";

export default async function sendEmailDeprovision(
  username: string,
  organizationName: string,
  email: string,
) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: `${organizationName} exceeds member limit on TicketBounty`,
    react: (
      <EmailDeprovision
        user={username}
        organization={organizationName}
      />
    ),
  });
}