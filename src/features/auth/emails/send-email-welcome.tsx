import EmailWelcome from "@/emails/auth/email-welcome";
import { resend } from "@/lib/resend";

export default async function sendEmailWelcome(username: string, email: string, loginUrl: string) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: email,
    subject: "Welcome to TicketBounty",
    react: <EmailWelcome toName={username} loginUrl={loginUrl} />,
  });
}
