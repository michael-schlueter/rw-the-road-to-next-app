import { prisma } from "@/lib/prisma";

export async function findCommentById(id: string) {
    return prisma.comment.findUnique({
        where: {
            id,
        },
        include: {
            ticket: true,
        }
    })
}