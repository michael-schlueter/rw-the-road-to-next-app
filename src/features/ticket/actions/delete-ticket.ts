"use server";

import { setCookieByKey } from "@/actions/cookies";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTicket(id: string) {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  revalidatePath(ticketsPath());
  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
}
