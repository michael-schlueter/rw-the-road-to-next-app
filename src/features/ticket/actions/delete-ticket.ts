"use server";

import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { redirect } from "next/navigation";

export async function deleteTicket(id: string) {
  await prisma.ticket.delete({
    where: {
      id,
    },
  });

  redirect(ticketsPath());
}
