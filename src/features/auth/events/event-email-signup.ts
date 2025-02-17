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
  async ({ event }) => {
    const { userId } = event.data;

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
