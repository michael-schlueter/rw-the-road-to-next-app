"use server";

import { prisma } from "@/lib/prisma";

export async function changeProfileInformation(userId: string, username: string, firstName: string, lastName: string) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
            firstName,
            lastName,
          },
        });
}