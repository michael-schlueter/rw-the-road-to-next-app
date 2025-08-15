import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

export const invitationProcessingEvent = inngest.createFunction(
  { id: "process-invitations-on-signup" },
  { event: "app/auth.sign-up" },
  async ({ event, step }) => {
    const { userId } = event.data;

    // Get the user to access their email
    const user = await step.run("fetch-user", async () => {
      return prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });
    });

    // Process invitations
    return await step.run("process-invitations", async () => {
      const invitations = await prisma.invitation.findMany({
        where: {
          email: user.email,
          status: "ACCEPTED_WITHOUT_ACCOUNT",
        },
      });

      await prisma.$transaction([
        prisma.membership.createMany({
          data: invitations.map((invitation) => ({
            organizationId: invitation.organizationId,
            userId: userId,
            membershipRole: "MEMBER",
            isActive: false,
          })),
        }),
        prisma.invitation.deleteMany({
          where: {
            tokenHash: { in: invitations.map((i) => i.tokenHash) },
          },
        }),
      ]);
    });
  }
);
