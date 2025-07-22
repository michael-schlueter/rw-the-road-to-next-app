import { AttachmentEntity } from "@prisma/client";

export interface FileMetadata {
  contentType?: string;
  fileName: string;
  size?: number;
}

export interface FileStorageOptions {
  expiresIn?: number; // For signed URLs in seconds
}

export interface FileStorageProvider {
  upload(key: string, file: Buffer, metadata: FileMetadata): Promise<void>;
  getDownloadUrl(key: string, options?: FileStorageOptions): Promise<string>;
  getFile(
    key: string
  ): Promise<{ data: ReadableStream; metadata: FileMetadata }>;
  delete(key: string): Promise<void>;
}

export interface StorageKeyParams {
  organizationId: string;
  entityId: string;
  entity: AttachmentEntity;
  fileName: string;
  attachmentId: string;
}
