import EmailTicketCount from "@/emails/admin/email-ticket-count";
import { resend } from "@/lib/resend";

export default async function sendEmailTicketCount(count: string) {
  return await resend.emails.send({
    // your own custom domain here
    from: "noreply@app.rulolab.com",
    to: "schluet0r4life@gmail.com",
    subject: "Ticket Count",
    react: <EmailTicketCount count={count} />,
  });
}
