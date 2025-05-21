import { FileWithPreview } from "../components/attachment-create-form";

export function revokeObjectUrls(files: FileWithPreview[]) {
  files.forEach((fileWithPreview) => {
    if (fileWithPreview.previewUrl) {
      URL.revokeObjectURL(fileWithPreview.previewUrl);
    }
  });
}
