import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { NextRequest } from "next/server";
import * as attachmentService from "@/features/attachments/services";
import { fileStorage } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  const { user } = await getAuthOrRedirect();

  const { attachmentId } = await params;

  const { attachment, subject } =
    await attachmentService.getAttachmentWithSubject(attachmentId, user.id);

  if (!subject || !attachment) {
    throw new Error("Not found");
  }

  const storageParams = {
    organizationId: subject.organizationId,
    entityId: subject.entityId,
    entity: subject.entity,
    fileName: attachment.name,
    attachmentId: attachment.id,
  };

  const { data } = await fileStorage.getFile(storageParams);

  const headers = new Headers();
  headers.append(
    "content-disposition",
    `attachment; filename="${attachment.name}"`
  );

  return new Response(data, {
    headers,
  });
}
