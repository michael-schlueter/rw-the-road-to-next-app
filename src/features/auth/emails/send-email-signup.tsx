import EmailSignUp from "@/emails/auth/email-signup";
import { resend } from "@/lib/resend";

export default async function sendEmailSignUp(username: string, email: string) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: "Welcome to TicketBounty",
    react: <EmailSignUp toName={username} />,
  });
}
