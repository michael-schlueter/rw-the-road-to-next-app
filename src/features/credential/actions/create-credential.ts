"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { getAdminOrRedirect } from "@/features/membership/queries/get-admin-or-redirect";
import { credentialsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateCredential } from "../utils/generate-credential";

const createCredentialScheme = z.object({
  name: z.string().min(1, { message: "Is required" }).max(191),
});

export async function createCredential(
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAdminOrRedirect(organizationId);

  let secret;

  try {
    const { name } = createCredentialScheme.parse({
      name: formData.get("name"),
    });

    secret = await generateCredential(organizationId, name, user.id);
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(credentialsPath(organizationId));

  return toActionState(
    "SUCCESS",
    "",
    undefined,
    { secret }
  );
}
