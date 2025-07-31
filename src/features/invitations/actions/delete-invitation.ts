"use server";

import { toActionState } from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import * as invitationData from "@/features/invitations/data";

type DeleteInvitation = {
  email: string;
  organizationId: string;
};

export async function deleteInvitation({
  email,
  organizationId,
}: DeleteInvitation) {
  await getAdminOrRedirect(organizationId);

  const invitation = await invitationData.findInvitationById({
    organizationId,
    email,
  });

  if (!invitation) {
    return toActionState("ERROR", "Invitation not found");
  }

  await invitationData.deleteInvitation({ organizationId, email });

  return toActionState("SUCCESS", "Invitation deleted");
}
