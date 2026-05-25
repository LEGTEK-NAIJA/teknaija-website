import { uploadImage, type UploadResult } from "./upload-image";

export type { UploadResult };

export function uploadPostImage(file: File) {
  return uploadImage(file, "post-images");
}
