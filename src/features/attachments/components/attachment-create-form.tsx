"use client";

import { useActionState } from "react";
import { createAttachments } from "../actions/create-attachments";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import Form from "@/components/form/form";
import { Input } from "@/components/ui/input";
import { ACCEPTED } from "../constants";
import FieldError from "@/components/form/field-error";
import SubmitButton from "@/components/form/submit-button";
import { AttachmentEntity } from "@prisma/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

type FileWithPreview = {
  file: File;
  previewUrl: string | null;
  isImage: boolean;
};

export default function AttachmentCreateForm({
  entityId,
  entity,
  buttons,
  onSuccess,
}: AttachmentCreateFormProps) {
  const [actionState, action] = useActionState(
    createAttachments.bind(null, { entityId, entity }),
    EMPTY_ACTION_STATE
  );

  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Convert from filelist to array
    const filesArray = Array.from(e.target.files);

    // Check if file is an image and add object url
    const newFilesWithPreview = filesArray.map((file) => {
      const isImage = ["image/png", "image/jpeg", "image/jpg"].includes(
        file.type
      );
      const previewUrl = isImage ? URL.createObjectURL(file) : null;

      return {
        file,
        previewUrl,
        isImage,
      };
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);

    // Reset input value so the same file can be selected again if removed
    e.target.value = "";
  };

  // Remove file from selection by its name
  const removeFile = (fileNameToRemove: string) => {
    const fileToRemove = selectedFiles.find(
      (selectedFile) => selectedFile.file.name === fileNameToRemove
    );

    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    setSelectedFiles((prevFiles) =>
      prevFiles.filter(
        (selectedFile) => selectedFile.file.name !== fileNameToRemove
      )
    );
  };

  // Clean up object URLs when component unmounts or selectedFiles change
  useEffect(() => {
    return () => {
      selectedFiles.forEach((fileWithPreview) => {
        if (fileWithPreview.previewUrl) {
          URL.revokeObjectURL(fileWithPreview.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  // Custom submit handler that correctly sets the files
  const handleSubmit = async (formData: FormData) => {
    // Replace the files in the formData
    formData.delete("files");
    selectedFiles.forEach(({ file }) => {
      formData.append("files", file);
    });

    // Call the action with updated formData
    return action(formData);
  };

  const handleFormSuccess = () => {
    // Clear local state for selected files
    setSelectedFiles([]);

    // Call onSuccess prop if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form action={handleSubmit} actionState={actionState} onSuccess={handleFormSuccess}>
      <div className="space-y-4">
        <Input
          name="files"
          id="files"
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          onChange={handleFileChange}
        />
        <FieldError actionState={actionState} name="files" />

        {selectedFiles.length > 0 && (
          <div className="space-y-3 mt-3">
            {selectedFiles.map((fileWithPreview) => (
              <div
                key={fileWithPreview.file.name}
                className="flex items-center border rounded p-2"
              >
                {fileWithPreview.isImage && fileWithPreview.previewUrl ? (
                  <div className="relative w-16 h-16 mr-3">
                    <Image
                      src={fileWithPreview.previewUrl}
                      alt={fileWithPreview.file.name}
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
                  <p
                    className="text-sm truncate"
                    title={fileWithPreview.file.name}
                  >
                    {fileWithPreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileWithPreview.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFile(fileWithPreview.file.name)}
                  className="ml-2 flex-shrink-0"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {buttons || <SubmitButton label="Upload" />}
      </div>
    </Form>
  );
}
