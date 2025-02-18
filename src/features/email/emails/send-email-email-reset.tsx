import EmailEmailReset from "@/emails/email/email-email-reset";
import { resend } from "@/lib/resend";

export default async function sendEmailEmailReset(
  username: string,
  email: string,
  emailResetLink: string
) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: "Email Reset from TicketBounty",
    react: <EmailEmailReset toName={username} url={emailResetLink} />,
  });
}
