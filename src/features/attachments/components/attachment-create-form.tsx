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
import AttachmentFilePreviewList from "./attachment-file-preview-list";

type AttachmentCreateFormProps = {
  entityId: string;
  entity: AttachmentEntity;
  buttons?: React.ReactNode;
  onSuccess?: () => void;
};

export type FileWithPreview = {
  id: string;
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
        id: crypto.randomUUID(),
        file,
        previewUrl,
        isImage,
      };
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesWithPreview]);

    // Reset input value so the same file can be selected again if removed
    e.target.value = "";
  };

  // Remove file from selection by its unique id
  const removeFile = (idToRemove: string) => {
    const fileToRemove = selectedFiles.find(
      (selectedFile) => selectedFile.id === idToRemove
    );

    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }

    setSelectedFiles((prevFiles) =>
      prevFiles.filter((selectedFile) => selectedFile.id !== idToRemove)
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
  }, []);

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
    <Form
      action={handleSubmit}
      actionState={actionState}
      onSuccess={handleFormSuccess}
    >
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

        <AttachmentFilePreviewList
          selectedFiles={selectedFiles}
          onRemoveFile={removeFile}
        />

        {buttons || <SubmitButton label="Upload" />}
      </div>
    </Form>
  );
}
