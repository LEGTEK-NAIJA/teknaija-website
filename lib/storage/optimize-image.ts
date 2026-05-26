"use client";

export type OptimizeResult = {
  file: File;
  originalBytes: number;
  finalBytes: number;
  optimized: boolean;
};

const MAX_LONG_EDGE = 1600;
const WEBP_QUALITY = 0.85;

export async function optimizeImage(file: File): Promise<OptimizeResult> {
  const originalBytes = file.size;

  if (file.type === "image/gif") {
    return { file, originalBytes, finalBytes: originalBytes, optimized: false };
  }

  let bitmap: HTMLImageElement;
  try {
    bitmap = await fileToBitmap(file);
  } catch {
    return { file, originalBytes, finalBytes: originalBytes, optimized: false };
  }

  const { width: srcW, height: srcH } = bitmap;
  const longEdge = Math.max(srcW, srcH);
  const scale = longEdge > MAX_LONG_EDGE ? MAX_LONG_EDGE / longEdge : 1;
  const targetW = Math.round(srcW * scale);
  const targetH = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { file, originalBytes, finalBytes: originalBytes, optimized: false };
  }
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  const blob = await canvasToBlob(canvas, "image/webp", WEBP_QUALITY);
  if (!blob) {
    return { file, originalBytes, finalBytes: originalBytes, optimized: false };
  }

  if (blob.size >= originalBytes && scale === 1) {
    return { file, originalBytes, finalBytes: originalBytes, optimized: false };
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  const optimizedFile = new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });

  return {
    file: optimizedFile,
    originalBytes,
    finalBytes: blob.size,
    optimized: true,
  };
}

function fileToBitmap(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
