"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAuth } from "@/features/auth/queries/get-auth";
import { organizationsPath, signInPath } from "@/paths";
import { redirect } from "next/navigation";
import * as invitationService from "@/features/invitations/services";

export async function acceptInvitation(tokenId: string) {
  const { user } = await getAuth();

  try {
    const result = await invitationService.acceptInvitation(tokenId);

    if (!result.success) {
      return toActionState("ERROR", result.error);
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
