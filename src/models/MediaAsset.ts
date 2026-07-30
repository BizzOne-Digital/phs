import { Schema, models, model } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, index: true },
    alt: { type: String, default: "" },
    filename: String,
    format: String,
    bytes: Number,
    width: Number,
    height: Number,
    folder: { type: String, default: "vnec" },
    tags: [String],
  },
  { timestamps: true }
);

MediaAssetSchema.index({ alt: "text", filename: "text", tags: "text" });

export const MediaAsset = models.MediaAsset || model("MediaAsset", MediaAssetSchema);
