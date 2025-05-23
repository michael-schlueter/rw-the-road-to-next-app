import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import * as attachmentService from "@/features/attachments/services";

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

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: generateS3Key({
        organizationId: subject.organizationId,
        entityId: subject.entityId,
        entity: subject.entity,
        fileName: attachment.name,
        attachmentId: attachment.id,
      }),
    }),
    { expiresIn: 5 * 60 }
  );

  const response = await fetch(presignedUrl);

  const headers = new Headers();
  headers.append(
    "content-disposition",
    `attachment; filename="${attachment.name}"`
  );

  return new Response(response.body, {
    headers,
  });
}
