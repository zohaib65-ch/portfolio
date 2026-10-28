import { type InferSchemaType, type Model, Schema, model, models } from "mongoose";

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "", trim: true },
    iconUrl: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "skills" }
);

skillSchema.index({ order: 1, createdAt: 1 });

export type SkillDoc = InferSchemaType<typeof skillSchema>;

export const Skill =
  (models.Skill as Model<SkillDoc>) || model<SkillDoc>("Skill", skillSchema);
