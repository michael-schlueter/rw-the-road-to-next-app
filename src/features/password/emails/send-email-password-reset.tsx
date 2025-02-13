import EmailPasswordReset from "@/emails/password/email-password-reset";
import { resend } from "@/lib/resend";

export default async function sendEmailPasswordReset(
  username: string,
  email: string,
  passwordResetLink: string
) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: "Password Reset from TicketBounty",
    react: <EmailPasswordReset toName={username} url={passwordResetLink} />,
  });
}
