import { prisma } from "@/lib/prisma";
import { emailResetPath } from "@/paths";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { getBaseUrl } from "@/utils/url";

const EMAIL_RESET_TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 2; // 2 hours

export async function generateEmailResetLink(userId: string) {
  await prisma.emailResetToken.deleteMany({
    where: {
      userId,
    },
  });

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await prisma.emailResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + EMAIL_RESET_TOKEN_LIFETIME_MS),
    },
  });

  const pageUrl = getBaseUrl() + emailResetPath();
  const emailResetLink = pageUrl + `/${tokenId}`;

  return emailResetLink;
}
