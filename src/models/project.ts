import { type InferSchemaType, type Model, Schema, model, models } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    href: { type: String, default: "", trim: true },
    dates: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    technologies: { type: [String], default: [] },
    links: {
      type: [
        new Schema(
          {
            label: { type: String, required: true, trim: true },
            href: { type: String, required: true, trim: true },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    image: { type: String, default: "", trim: true },
    video: { type: String, default: "", trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "projects" }
);

projectSchema.index({ order: 1, createdAt: 1 });

export type ProjectDoc = InferSchemaType<typeof projectSchema>;

export const Project =
  (models.Project as Model<ProjectDoc>) ||
  model<ProjectDoc>("Project", projectSchema);
