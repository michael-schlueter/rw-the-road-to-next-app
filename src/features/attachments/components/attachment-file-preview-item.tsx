"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type AttachmentFilePreviewItemProps = {
  id: string;
  fileName: string;
  fileSize: number;
  previewUrl: string | null;
  isImage: boolean;
  onRemove: (id: string) => void;
};

export default function AttachmentFilePreviewItem({
  id,
  fileName,
  fileSize,
  previewUrl,
  isImage,
  onRemove,
}: AttachmentFilePreviewItemProps) {
  return (
    <div className="flex items-center border rounded p-2">
      {isImage && previewUrl ? (
        <div className="relative w-16 h-16 mr-3">
          <Image
            src={previewUrl}
            alt={fileName}
            fill
            sizes="64px"
            className="object-cover rounded"
            unoptimized
          />
        </div>
      ) : (
        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 mr-3 rounded">
          <span className="text-xs text-gray-500 text-center px-1">
            Preview not available
          </span>
        </div>
      )}

      <div className="flex-grow min-w-0">
        <p className="text-sm truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-gray-500">
          {(fileSize / 1024).toFixed(1)} KB
        </p>
      </div>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => onRemove(id)}
        className="ml-2 flex-shrink-0"
      >
        Remove
      </Button>
    </div>
  );
}
