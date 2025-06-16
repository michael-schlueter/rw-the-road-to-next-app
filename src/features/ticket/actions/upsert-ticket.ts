"use server";

import { setCookieByKey } from "@/actions/cookies";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { toCent } from "@/utils/currency";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getTicketPermissions } from "../permissions/get-ticket-permission";
import { getStripeCustomberByOrganization } from "@/features/stripe/queries/get-stripe-customer";
import { isActiveSubscription } from "@/features/stripe/utils/is-active-subscription";

export async function upsertTicket(
  id: string | undefined,
  _actionState: ActionState,
  formData: FormData
) {
  const { user, activeOrganization } = await getAuthOrRedirect();

  const upsertTicketSchema = z.object({
    title: z.string().min(1).max(191),
    content: z.string().min(1).max(1024),
    deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Is required"),
    bounty: z.coerce.number().positive(),
    private: z.boolean().default(false),
  });

  // Server-side validation for 'private' field based on subscription
  const stripeCustomer = await getStripeCustomberByOrganization(
    activeOrganization?.id
  );
  const hasActiveSub = isActiveSubscription(stripeCustomer);
  const wantsToSetPrivate = formData.get("private") === "on";

  // Should not happen because we do not render the checkbox for users without active sub
  if (wantsToSetPrivate && !hasActiveSub) {
    return toActionState(
      "ERROR",
      "You need an active subscription to mark a ticket as private"
    );
  }

  try {
    if (id) {
      const ticket = await prisma.ticket.findUnique({
        where: {
          id,
        },
      });

      const permissions = await getTicketPermissions({
        organizationId: activeOrganization?.id,
        userId: user.id,
      });

      if (!ticket || !isOwner(user, ticket) || !permissions.canUpdateTicket) {
        return toActionState("ERROR", "Not authorized");
      }
    }

    const data = upsertTicketSchema.parse({
      title: formData.get("title"),
      content: formData.get("content"),
      deadline: formData.get("deadline"),
      bounty: formData.get("bounty"),
      private: wantsToSetPrivate,
    });

    const dbData = {
      ...data,
      userId: user.id,
      bounty: toCent(data.bounty),
    };

    await prisma.ticket.upsert({
      where: {
        id: id || "",
      },
      update: dbData,
      create: { ...dbData, organizationId: activeOrganization!.id },
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(ticketsPath());

  if (id) {
    await setCookieByKey("toast", "Ticket updated");
    redirect(ticketPath(id));
  }

  return toActionState("SUCCESS", "Ticket created");
}
