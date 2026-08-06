/**
 * Browser-side resize/compress so phone photos fit Vercel body limits (~4.5MB).
 */
export async function compressImageForUpload(
  file: File,
  opts?: { maxWidth?: number; quality?: number }
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const maxWidth = opts?.maxWidth ?? 2000;
  const quality = opts?.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxWidth / Math.max(bitmap.width, 1));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const preferWebp = typeof canvas.toBlob === "function";
    const mime =
      file.type === "image/png" && scale === 1 ? "image/png" : "image/webp";

    const blob: Blob | null = await new Promise((resolve) => {
      if (!preferWebp) {
        resolve(null);
        return;
      }
      canvas.toBlob((b) => resolve(b), mime === "image/png" ? "image/png" : "image/webp", quality);
    });

    if (!blob) {
      // Fallback JPEG
      const jpegBlob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
      });
      if (!jpegBlob || jpegBlob.size >= file.size) return file;
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([jpegBlob], name, { type: "image/jpeg", lastModified: Date.now() });
    }

    if (blob.size >= file.size && scale === 1) return file;

    const ext = blob.type === "image/png" ? ".png" : blob.type === "image/webp" ? ".webp" : ".jpg";
    const name = file.name.replace(/\.[^.]+$/, "") + ext;
    return new File([blob], name, { type: blob.type, lastModified: Date.now() });
  } finally {
    bitmap.close?.();
  }
}
