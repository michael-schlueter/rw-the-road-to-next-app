import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { prisma } from "@/lib/prisma";

export default async function getComment(id: string) {
  const { user } = await getAuth();

  const comment = await prisma.comment.findUnique({
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

  if (!comment) return null;

  return { ...comment, isOwner: isOwner(user, comment) };
}
