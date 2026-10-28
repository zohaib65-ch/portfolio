import { type InferSchemaType, type Model, Schema, model, models } from "mongoose";

const workExperienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    href: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    logoUrl: { type: String, default: "", trim: true },
    start: { type: String, required: true, trim: true },
    end: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "work_experiences" }
);

workExperienceSchema.index({ order: 1, createdAt: 1 });

export type WorkExperienceDoc = InferSchemaType<typeof workExperienceSchema>;

export const WorkExperience =
  (models.WorkExperience as Model<WorkExperienceDoc>) ||
  model<WorkExperienceDoc>("WorkExperience", workExperienceSchema);
