import { Schema, models, model, type InferSchemaType } from "mongoose";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/upload/types";

export { UPLOAD_FOLDERS, type UploadFolder };

const StoredUploadSchema = new Schema(
  {
    folder: {
      type: String,
      enum: UPLOAD_FOLDERS,
      required: true,
      index: true,
    },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDocument = InferSchemaType<typeof StoredUploadSchema> & {
  _id: Schema.Types.ObjectId;
};

export const StoredUpload =
  models.StoredUpload || model("StoredUpload", StoredUploadSchema);
