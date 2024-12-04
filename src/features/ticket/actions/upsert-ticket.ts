"use server";

import { prisma } from "@/lib/prisma";
import { ticketPath, ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function upsertTicket(id: string | undefined, _actionState: { message: string }, formData: FormData) {
  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  await prisma.ticket.upsert({
    where: {
      id: id || "",
    },
    update: data,
    create: data,
  });

  revalidatePath(ticketsPath());

  if (id) {
    redirect(ticketPath(id));
  }

  return {
    message: "Ticket has been created",
  };
}
