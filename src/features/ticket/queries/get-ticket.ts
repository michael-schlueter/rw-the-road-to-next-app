import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { getTicketPermissions } from "../permissions/get-ticket-permission";
import { getActiveOrganization } from "@/features/organization/queries/get-active-organization";
import { getStripeCustomberByOrganization } from "@/features/stripe/queries/get-stripe-customer";
import { isActiveSubscription } from "@/features/stripe/utils/is-active-subscription";

export default async function getTicket(id: string) {
  const { user } = await getAuth();
    const activeOrganization = await getActiveOrganization();
    const stripeCustomer = await getStripeCustomberByOrganization(
      activeOrganization?.id
    );
    const hasActiveSubscription = await isActiveSubscription(stripeCustomer);

  const ticket = await prisma.ticket.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!ticket || (ticket.private && !hasActiveSubscription)) return null;

  const permissions = await getTicketPermissions({
    organizationId: ticket.organizationId,
    userId: user?.id,
  });

  return {
    ...ticket,
    isOwner: isOwner(user, ticket),
    permissions: {
      canDeleteTicket: isOwner(user, ticket) && !!permissions.canDeleteTicket,
      canUpdateTicket: isOwner(user, ticket) && !!permissions.canUpdateTicket,
    },
  };
}
