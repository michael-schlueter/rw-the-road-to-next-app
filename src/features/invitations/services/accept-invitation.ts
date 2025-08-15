import { hashToken } from "@/utils/crypto";
import * as invitationData from "@/features/invitations/data";
import * as userData from "@/features/auth/data";
import { Invitation } from "@prisma/client";

type SuccessResult = {
    success: true;
    invitation: Invitation;
}

type ErrorResult = {
    success: false;
    error: string;
}

type InvitationAcceptResult = SuccessResult | ErrorResult

export async function acceptInvitation(tokenId: string, email: string | undefined): Promise<InvitationAcceptResult> {
  const tokenHash = hashToken(tokenId);

  const invitation = await invitationData.findInvitationByToken(tokenHash);

  if (!invitation) {
    return { success: false, error: "Revoked or invalid invitation" };
  }

  if (email && invitation.email !== email) {
    return { success: false, error: "The invitation was not intended for you" }
  }

  const user = await userData.findUserByEmail(invitation.email);

  if (user) {
    await invitationData.acceptInvitationForExistingUser(
      tokenHash,
      invitation.organizationId,
      user.id
    );
  } else {
    await invitationData.acceptInvitationForNewUser(tokenHash);
  }

  return { success: true, invitation };
}
