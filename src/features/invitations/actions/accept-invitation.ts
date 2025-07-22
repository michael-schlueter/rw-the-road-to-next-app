"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { organizationsPath, signInPath } from "@/paths";
import { hashToken } from "@/utils/crypto";
import { redirect } from "next/navigation";
import * as invitationData from "../data";
import * as userData from "../../auth/data";

export async function acceptInvitation(tokenId: string) {
  const { user } = await getAuth();

  try {
    const tokenHash = hashToken(tokenId);

    const invitation = await invitationData.findInvitationByToken(tokenHash);

    if (!invitation) {
      return toActionState("ERROR", "Revoked or invalid invitation token");
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
  } catch (error) {
    return fromErrorToActionState(error);
  }

  if (!user) {
    redirect(signInPath());
  } else {
    redirect(organizationsPath());
  }
}
