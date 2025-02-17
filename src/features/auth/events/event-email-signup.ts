import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import sendEmailSignUp from "../emails/send-email-signup";

export type EmailSignUpEventArgs = {
  data: {
    userId: string;
  };
};

export const emailSignUpFunction = inngest.createFunction(
  { id: "email-signup" },
  { event: "app/auth.sign-up" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // Add a 3-minute delay
    await step.sleep("wait-3-minutes", "3m");

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await sendEmailSignUp(user.username, user.email);

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  }
);
