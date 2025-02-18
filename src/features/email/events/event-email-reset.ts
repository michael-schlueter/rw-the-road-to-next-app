import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import sendEmailEmailReset from "../emails/send-email-email-reset";
import { generateEmailResetLink } from "../utils/generate-email-reset-link";

export type EmailResetEventArgs = {
  data: {
    userId: string;
  };
};

export const emailResetFunction = inngest.createFunction(
  { id: "send-email-reset" },
  { event: "app/email.email-reset" },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const emailResetLink = await generateEmailResetLink(user.id);
    const result = await sendEmailEmailReset(
      user.username,
      user.email,
      emailResetLink
    );

    if (result.error) {
      throw new Error(`${result.error.name}: ${result.error.message}`);
    }

    return { event, body: result };
  }
);
