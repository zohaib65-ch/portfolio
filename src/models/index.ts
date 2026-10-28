import type { Model } from "mongoose";
import type { ResourceKey } from "@/lib/types";
import { Project } from "./project";
import { Skill } from "./skill";
import { WorkExperience } from "./work-experience";

export { LoginAttempt } from "./login-attempt";
export { Project, Skill, WorkExperience };

/** Fields every managed collection shares, used by the generic admin actions. */
export type Orderable = { order: number; visible: boolean };

export const RESOURCE_KEYS = ["work", "skills", "projects"] as const;

export function getModel(resource: ResourceKey) {
  const models = {
    work: WorkExperience,
    skills: Skill,
    projects: Project,
  };
  return models[resource] as unknown as Model<Orderable>;
}
