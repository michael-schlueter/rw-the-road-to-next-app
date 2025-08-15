import { prisma } from "@/lib/prisma";
import { emailInvitationPath } from "@/paths";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { getBaseUrl } from "@/utils/url";

export async function generateInvitationLink(
  invitedByUserId: string,
  organizationId: string,
  email: string
) {

  const tokenId = generateRandomToken();
  const tokenHash = hashToken(tokenId);

  await prisma.invitation.create({
    data: {
      tokenHash,
      invitedByUserId,
      organizationId,
      email,
    },
  });

  const pageUrl = getBaseUrl() + emailInvitationPath();
  const emailInvitationLink = pageUrl + `/${tokenId}`;

  return emailInvitationLink;
}
