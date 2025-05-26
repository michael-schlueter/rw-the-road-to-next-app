import { prisma } from "@/lib/prisma";

export async function getStripeCustomberByOrganization(
  organizationId: string | null | undefined
) {
  if (!organizationId) return null;

  return prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });
}
