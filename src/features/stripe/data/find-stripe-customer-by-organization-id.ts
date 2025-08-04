import { prisma } from "@/lib/prisma";

export async function findStripeCustomerByOrganizationId(
  organizationId: string
) {
  return await prisma.stripeCustomer.findUnique({
    where: {
      organizationId,
    },
  });
}
