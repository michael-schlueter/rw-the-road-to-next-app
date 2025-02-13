import EmailVerification from "@/emails/auth/email-verification";
import { resend } from "@/lib/resend";

export default async function sendEmailVerification(
  username: string,
  email: string,
  verificationCode: string
) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: "Email Verification from TicketBounty",
    react: <EmailVerification toName={username} code={verificationCode} />,
  });
}
