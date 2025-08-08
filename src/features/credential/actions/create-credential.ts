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
import { prisma } from "@/lib/prisma";
import { AVAILABLE_SCOPES } from "../constants";

const createCredentialScheme = z.object({
  name: z.string().min(1, { message: "Is required" }).max(191),
  scopes: z
    .array(z.enum(AVAILABLE_SCOPES))
    .min(1, { message: "At least one scope is required" }),
});

export async function createCredential(
  organizationId: string,
  _actionState: ActionState,
  formData: FormData
) {
  const { user } = await getAdminOrRedirect(organizationId);

  let secret;

  try {
    const { name, scopes } = createCredentialScheme.parse({
      name: formData.get("name"),
      scopes: formData.getAll("scopes"),
    });

    const { credentialSecret, credential } = await generateCredential(
      organizationId,
      name,
      user.id
    );
    secret = credentialSecret;

    await prisma.credentialScope.createMany({
      data: scopes.map((scope) => ({
        credentialId: credential.id,
        scope,
      })),
    });
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }

  revalidatePath(credentialsPath(organizationId));

  return toActionState("SUCCESS", "", undefined, { secret });
}
