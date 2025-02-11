import { inngest } from "@/lib/inngest";
import sendEmailPasswordReset from "../emails/send-email-password-reset";
import { generatePasswordResetLink } from "../utils/generate-password-reset-link";
import { prisma } from "@/lib/prisma";

export type PasswordResetEventArgs = {
  data: {
    userId: string;
  };
};

export const passwordResetFunction = inngest.createFunction(
  { id: "send-password-reset" },
  { event: "app/password.password-reset" },
  async ({ event }) => {
    const { userId } = event.data;

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const passwordResetLink = await generatePasswordResetLink(user.id);
    const result = await sendEmailPasswordReset(
      user.username,
      user.email,
      passwordResetLink
    );

    return { event, body: result };
  }
);
