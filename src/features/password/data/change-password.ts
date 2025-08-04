import { prisma } from "@/lib/prisma";

export async function changePassword(
  userId: string,
  newPassword: string
) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: newPassword,
    },
  });
}
