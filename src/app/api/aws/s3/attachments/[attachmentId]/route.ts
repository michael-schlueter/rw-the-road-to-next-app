import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { generateS3Key } from "@/features/attachments/utils/generate-s3-key";
import { getOrganizationIdByAttachment } from "@/features/attachments/utils/helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  await getAuthOrRedirect();

  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: {
      id: attachmentId,
    },
    include: {
      ticket: true,
      comment: {
        include: {
          ticket: true,
        },
      },
    },
  });

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject) {
    throw new Error("Subject not found");
  }

  const organizationId = getOrganizationIdByAttachment(
    attachment.entity,
    subject
  );

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: generateS3Key({
        organizationId,
        entityId: subject.id,
        entity: attachment.entity,
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
