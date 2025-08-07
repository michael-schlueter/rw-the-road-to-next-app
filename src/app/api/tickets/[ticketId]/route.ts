import getTicket from "@/features/ticket/queries/get-ticket";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/paths";
import { hashToken } from "@/utils/crypto";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;
  const ticket = await getTicket(ticketId);

  return Response.json(ticket);
}

export async function DELETE(
  { headers }: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await params;

  const bearerToken = new Headers(headers).get("Authorization");
  const authToken = (bearerToken || "").split("Bearer ").at(1);

  if (!authToken) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }

  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return Response.json({ error: "Ticket not found" }, { status: 404 });
  }

  const hashedToken = hashToken(authToken);

  const credential = await prisma.credential.findUnique({
    where: {
      secretHash: hashedToken,
      organizationId: ticket.organizationId,
    },
    include: {
      scopes: true,
    },
  });

  if (!credential) {
    return Response.json({ error: "Not authorized" }, { status: 401 });
  }

  const hasScope = credential.scopes.some(
    (scope) => scope.scope === "delete:ticket"
  );

  if (!hasScope) {
    return Response.json(
      { error: "Missing required scope: delete:ticket" },
      { status: 403 }
    );
  }

  await prisma.$transaction([
    prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    }),
    prisma.credential.update({
      where: {
        id: credential.id,
      },
      data: {
        lastUsed: new Date(),
      },
    }),
  ]);

  revalidatePath(ticketsPath());

  return Response.json({ ticketId });
}
