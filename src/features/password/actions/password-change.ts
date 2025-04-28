"use server";

import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { hashPassword, verifyPasswordHash } from "../utils/hash-and-verify";

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(6).max(191),
  newPassword: z.string().min(6).max(191),
  confirmPassword: z.string().min(6).max(191),
});

export async function passwordChange(
  _actionState: ActionState,
  formData: FormData
) {
  const auth = await getAuthOrRedirect();

  try {
    const { currentPassword, newPassword, confirmPassword } = passwordChangeSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const user = await prisma.user.findUnique({
      where: { email: auth.user.email },
    });

    if (!user) {
      // we should never reach this return statement but it's here just in case
      return toActionState("ERROR", "Invalid request", formData);
    }

    const validPassword = await verifyPasswordHash(user.passwordHash, currentPassword);

    if (!validPassword) {
      return toActionState("ERROR", "Incorrect password", formData);
    }

    if (newPassword !== confirmPassword) {
      return toActionState("ERROR", "Passwords do not match", formData);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: hashedPassword
      }
    })
  } catch (error) {
    return fromErrorToActionState(error, formData);
  }
  return toActionState("SUCCESS", "Password successfully changed");
}

// "use server";

// import {
//   ActionState,
//   fromErrorToActionState,
//   toActionState,
// } from "@/components/form/utils/to-action-state";
// import { z } from "zod";
// import { prisma } from "@/lib/prisma";
// import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
// import { verifyPasswordHash } from "../utils/hash-and-verify";
// import { inngest } from "@/lib/inngest";

// const passwordChangeSchema = z.object({
//   password: z.string().min(6).max(191),
// });

// export async function passwordChange(
//   _actionState: ActionState,
//   formData: FormData
// ) {
//   const auth = await getAuthOrRedirect();

//   try {
//     const { password } = passwordChangeSchema.parse({
//       password: formData.get("password"),
//     });

//     const user = await prisma.user.findUnique({
//       where: { email: auth.user.email },
//     });

//     if (!user) {
//       // we should never reach this return statement but it's here just in case
//       return toActionState("ERROR", "Invalid request", formData);
//     }

//     const validPassword = await verifyPasswordHash(user.passwordHash, password);

//     if (!validPassword) {
//       return toActionState("ERROR", "Incorrect password", formData);
//     }

//     await inngest.send({
//       name: "app/password.password-reset",
//       data: {
//         userId: user.id,
//       },
//     });
//   } catch (error) {
//     return fromErrorToActionState(error, formData);
//   }
//   return toActionState("SUCCESS", "Check your email for a reset link");
// }

