"use client";

import { FileWithPreview } from "./attachment-create-form";
import AttachmentFilePreviewItem from "./attachment-file-preview-item";

type AttachmentFilePreviewListProps = {
  selectedFiles: FileWithPreview[];
  onRemoveFile: (id: string) => void;
};

export default function AttachmentFilePreviewList({
  selectedFiles,
  onRemoveFile,
}: AttachmentFilePreviewListProps) {
  if (selectedFiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-3">
      {selectedFiles.map((fileWithPreview) => (
        <AttachmentFilePreviewItem
          key={fileWithPreview.id}
          id={fileWithPreview.id}
          fileName={fileWithPreview.file.name}
          fileSize={fileWithPreview.file.size}
          previewUrl={fileWithPreview.previewUrl}
          isImage={fileWithPreview.isImage}
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
}
