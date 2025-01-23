import { prisma } from "@/lib/prisma";
import { SearchParams } from "../search-params";

export default async function getTickets(
  userId: string | undefined,
  searchParams: SearchParams
) {
  return await prisma.ticket.findMany({
    where: {
      userId,
      title: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
