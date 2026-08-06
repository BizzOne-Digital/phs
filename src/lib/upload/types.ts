export const UPLOAD_FOLDERS = ["pages", "products", "gallery", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
