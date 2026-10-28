import { type InferSchemaType, type Model, Schema, model, models } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Format: scrypt$N$r$p$salt$hash. Never store or log the plain password.
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, collection: "admins" }
);

type AdminDoc = InferSchemaType<typeof adminSchema>;

export const Admin =
  (models.Admin as Model<AdminDoc>) || model<AdminDoc>("Admin", adminSchema);
