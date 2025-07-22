import { s3 } from "../aws";
import { generateStorageKey } from "./keys";
import { S3FileStorageProvider } from "./providers/s3-provider";
import {
  FileMetadata,
  FileStorageOptions,
  FileStorageProvider,
  StorageKeyParams,
} from "./types";

class FileStorage {
  private provider: FileStorageProvider;

  constructor(provider: FileStorageProvider) {
    this.provider = provider;
  }

  async uploadBuffer(
    params: StorageKeyParams,
    file: Buffer,
    contentType?: string
  ): Promise<void> {
    const key = generateStorageKey(params);
    await this.provider.upload(key, file, {
      fileName: params.fileName,
      contentType,
    });
  }

  async uploadFile(
    params: Omit<StorageKeyParams, "fileName">,
    file: File
  ): Promise<void> {
    const buffer = Buffer.from(await file.arrayBuffer());
    await this.uploadBuffer(
      {
        ...params,
        fileName: file.name,
      },
      buffer,
      file.type
    );
  }

  async getDownloadUrl(
    params: StorageKeyParams,
    options?: FileStorageOptions
  ): Promise<string> {
    const key = generateStorageKey(params);
    return this.provider.getDownloadUrl(key, options);
  }

  async getFile(
    params: StorageKeyParams
  ): Promise<{ data: ReadableStream; metadata: FileMetadata }> {
    const key = generateStorageKey(params);
    return this.provider.getFile(key);
  }

  async delete(params: StorageKeyParams): Promise<void> {
    const key = generateStorageKey(params);
    await this.provider.delete(key);
  }
}

// Create and export default instance using S3 provider
const bucketName = process.env.AWS_BUCKET_NAME as string;
const s3Provider = new S3FileStorageProvider(s3, bucketName);
export const fileStorage = new FileStorage(s3Provider);

// Export types and classes for extension
export { FileStorage, S3FileStorageProvider };
export * from "./types";
