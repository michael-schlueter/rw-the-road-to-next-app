import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import {
  FileMetadata,
  FileStorageOptions,
  FileStorageProvider,
} from "../types";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3FileStorageProvider implements FileStorageProvider {
  private s3: S3Client;
  private bucketName: string;

  constructor(s3: S3Client, bucketName: string) {
    this.s3 = s3;
    this.bucketName = bucketName;

    if (!bucketName) {
      throw new Error("S3 bucket name is required");
    }
  }

  async upload(
    key: string,
    file: Buffer,
    metadata: FileMetadata
  ): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: metadata.contentType,
      })
    );
  }

  async getDownloadUrl(
    key: string,
    options?: FileStorageOptions
  ): Promise<string> {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
      { expiresIn: options?.expiresIn || 5 * 60 } // Default 5 minutes
    );
  }

  async getFile(
    key: string
  ): Promise<{ data: ReadableStream; metadata: FileMetadata }> {
    const response = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );

    if (!response.Body) {
      throw new Error("File not found");
    }

    return {
      data: response.Body as ReadableStream,
      metadata: {
        contentType: response.ContentType,
        fileName: key.split("/").pop() || key,
        size: response.ContentLength,
      },
    };
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }
}
