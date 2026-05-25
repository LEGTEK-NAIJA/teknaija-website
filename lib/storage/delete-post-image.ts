import {
  deleteImage,
  extractImagePath,
  type DeleteResult,
} from "./delete-image";

export type { DeleteResult };

export function extractPostImagePath(url: string): string | null {
  return extractImagePath(url, "post-images");
}

export function deletePostImage(url: string) {
  return deleteImage(url, "post-images");
}
