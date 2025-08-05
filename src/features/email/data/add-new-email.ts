"use server";

import { prisma } from "@/lib/prisma";

export async function addNewEmail(userId: string, newEmail: string) {
    return await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            newEmail,
            emailVerified: false,
          },
        });
}