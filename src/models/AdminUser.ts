import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type AdminUserDocument = InferSchemaType<typeof AdminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AdminUser =
  models.AdminUser || model("AdminUser", AdminUserSchema);
