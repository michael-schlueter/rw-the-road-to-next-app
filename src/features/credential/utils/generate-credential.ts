import { prisma } from "@/lib/prisma";
import { generateRandomToken, hashToken } from "@/utils/crypto";

export async function generateCredential(
  organizationId: string,
  name: string,
  userId: string
) {
  const credentialSecret = generateRandomToken();
  const secretHash = hashToken(credentialSecret);

  const credential = await prisma.credential.create({
    data: {
      secretHash,
      organizationId,
      name,
      userId,
    },
  });

  return { credentialSecret, credential };
}
