import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

const configured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

if (configured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type UploadImageResult = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

export function isCloudinaryConfigured(): boolean {
  return configured;
}

function toDataUri(input: Buffer | string, mime = "image/jpeg"): string {
  if (typeof input === "string") {
    if (input.startsWith("data:") || input.startsWith("http://") || input.startsWith("https://")) {
      return input;
    }
    // Raw base64
    return `data:${mime};base64,${input}`;
  }
  return `data:${mime};base64,${input.toString("base64")}`;
}

/**
 * Upload an image from a Buffer, raw base64 string, data URI, or remote URL.
 * When Cloudinary is not configured, returns a graceful local/placeholder result.
 */
export async function uploadImage(
  input: Buffer | string,
  folder = "vnec",
  options?: { mime?: string }
): Promise<UploadImageResult> {
  const dataUri = toDataUri(input, options?.mime);

  if (!configured) {
    const fallbackUrl =
      dataUri.startsWith("http://") || dataUri.startsWith("https://")
        ? dataUri
        : "/logo.svg";
    return {
      url: fallbackUrl,
      publicId: `local-${Date.now()}`,
    };
  }

  const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<boolean> {
  if (!configured || !publicId || publicId.startsWith("local-")) {
    return false;
  }
  await cloudinary.uploader.destroy(publicId);
  return true;
}

export { cloudinary };
