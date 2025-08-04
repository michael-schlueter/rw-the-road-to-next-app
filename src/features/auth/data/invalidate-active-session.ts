import { prisma } from "@/lib/prisma";

export async function invalidateActiveSession(userId: string) {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}
