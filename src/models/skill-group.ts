import { Schema, model, models, type Model } from "mongoose";

// Group names offered in the skill form's dropdown. A group that skills already
// use shows up there even without a row here; rows exist so a group added from
// the "New group" dialog sticks around before any skill uses it.
const skillGroupSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Lowercased name, so "frontend" and "Frontend" count as the same group.
    key: { type: String, required: true, unique: true },
  },
  { timestamps: true, collection: "skill_groups" }
);

interface SkillGroupDoc {
  name: string;
  key: string;
}

export const SkillGroup =
  (models.SkillGroup as Model<SkillGroupDoc>) ||
  model<SkillGroupDoc>("SkillGroup", skillGroupSchema);
