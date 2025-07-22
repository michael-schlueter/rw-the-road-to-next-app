import { StorageKeyParams } from "./types";

export function generateStorageKey(params: StorageKeyParams): string {
  const { organizationId, entityId, entity, fileName, attachmentId } = params;
  return `organizations/${organizationId}/${entity.toLowerCase()}s/${entityId}/attachments/${attachmentId}/${fileName}`;
}
