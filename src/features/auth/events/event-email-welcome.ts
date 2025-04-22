import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import sendEmailWelcome from "../emails/send-email-welcome";
import { generateLoginLink } from "@/features/email/utils/generate-login-link";

export type EmailWelcomeEventArgs = {
  data: {
    userId: string;
  };
};

export const emailWelcomeFunction = inngest.createFunction(
  { id: "email-signup" },
  { event: "app/auth.sign-up" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // Add a 3-minute delay
    await step.sleep("wait-3-minutes", "3m");

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const loginUrl = generateLoginLink();

    const result = await sendEmailWelcome(user.username, user.email, loginUrl);

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  }
);
