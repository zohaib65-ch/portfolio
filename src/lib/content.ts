import type { Model, Types } from "mongoose";
import { DATA } from "@/data/resume";
import { connectDb, isDbConfigured } from "@/lib/db";
import { isObjectId } from "@/lib/ids";
import { findSkillIconKey } from "@/lib/skill-icons";
import type { ProjectItem, SkillGroupOption, SkillItem, WorkItem } from "@/lib/types";
import {
  Project,
  Skill,
  WorkExperience,
  type Orderable,
} from "@/models";
import type { ProjectDoc } from "@/models/project";
import type { SkillDoc } from "@/models/skill";
import { SkillGroup } from "@/models/skill-group";
import type { WorkExperienceDoc } from "@/models/work-experience";

type Lean<T> = T & { _id: Types.ObjectId };

const SORT = { order: 1, createdAt: 1, _id: 1 } as const;

// ---------------------------------------------------------------------------
// Document -> plain item mappers
// ---------------------------------------------------------------------------

function toWork(doc: Lean<WorkExperienceDoc>): WorkItem {
  return {
    id: String(doc._id),
    company: doc.company,
    title: doc.title,
    href: doc.href ?? "",
    location: doc.location ?? "",
    logoUrl: doc.logoUrl ?? "",
    start: doc.start,
    end: doc.end ?? "",
    description: doc.description ?? "",
    visible: doc.visible ?? true,
  };
}

function toSkill(doc: Lean<SkillDoc>): SkillItem {
  return {
    id: String(doc._id),
    name: doc.name,
    icon: doc.icon ?? "",
    iconUrl: doc.iconUrl ?? "",
    group: doc.group ?? "",
    visible: doc.visible ?? true,
  };
}

function toProject(doc: Lean<ProjectDoc>): ProjectItem {
  return {
    id: String(doc._id),
    title: doc.title,
    href: doc.href ?? "",
    dates: doc.dates ?? "",
    description: doc.description ?? "",
    technologies: [...(doc.technologies ?? [])],
    links: (doc.links ?? []).map((link) => ({
      label: link.label,
      href: link.href,
    })),
    image: doc.image ?? "",
    video: doc.video ?? "",
    visible: doc.visible ?? true,
  };
}

// ---------------------------------------------------------------------------
// Built-in content (src/data/resume.tsx), used when MongoDB isn't available.
// ---------------------------------------------------------------------------

function templateWork(): Omit<WorkItem, "id">[] {
  return DATA.work.map((work) => ({
    company: work.company,
    title: work.title,
    href: work.href,
    location: work.location,
    logoUrl: work.logoUrl,
    start: work.start,
    end: work.end,
    description: work.description,
    visible: true,
  }));
}

function templateSkills(): Omit<SkillItem, "id">[] {
  return DATA.skills.map((skill) => ({
    name: skill.name,
    icon: skill.icon ? findSkillIconKey(skill.icon) : "",
    iconUrl: skill.iconUrl ?? "",
    group: skill.group ?? "",
    visible: true,
  }));
}

function templateProjects(): Omit<ProjectItem, "id">[] {
  return DATA.projects.map((project) => ({
    title: project.title,
    href: project.href,
    dates: project.dates,
    description: project.description,
    technologies: [...project.technologies],
    links: project.links.map((link) => ({ label: link.type, href: link.href })),
    image: project.image,
    video: project.video,
    visible: true,
  }));
}

function withStaticIds<T extends { id: string }>(items: Omit<T, "id">[]) {
  return items.map((item, index) => ({ ...item, id: `static-${index}` }) as T);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

function createRepository<D extends Orderable, T>(
  model: Model<D>,
  toItem: (doc: Lean<D>) => T,
  fallback: () => T[]
) {
  return {
    /** Every entry including hidden ones. For the admin panel. */
    async all(): Promise<T[]> {
      await connectDb();
      const docs = await model.find().sort(SORT).lean<Lean<D>[]>();
      return docs.map(toItem);
    },

    async byId(id: string): Promise<T | null> {
      if (!isObjectId(id)) return null;
      await connectDb();
      const doc = await model.findById(id).lean<Lean<D>>();
      return doc ? toItem(doc) : null;
    },

    /**
     * Visible entries for the public site. Falls back to the built-in content
     * when MongoDB isn't configured or can't be reached, so the site keeps
     * rendering. A reachable database is the source of truth, even if empty.
     */
    async visible(): Promise<T[]> {
      if (!isDbConfigured()) return fallback();
      try {
        await connectDb();
        const docs = await model
          .find({ visible: true } as never)
          .sort(SORT)
          .lean<Lean<D>[]>();
        return docs.map(toItem);
      } catch (error) {
        console.error("[content] MongoDB unavailable, using built-in data", error);
        return fallback();
      }
    },
  };
}

export const workRepo = createRepository(WorkExperience, toWork, () =>
  withStaticIds<WorkItem>(templateWork())
);
export const skillRepo = createRepository(Skill, toSkill, () =>
  withStaticIds<SkillItem>(templateSkills())
);
export const projectRepo = createRepository(Project, toProject, () =>
  withStaticIds<ProjectItem>(templateProjects())
);

/**
 * Every skill group: the ones skills use (in the order they appear on the site)
 * with how many skills each has, then groups added in the admin that no skill
 * uses yet. Throws if MongoDB can't be reached.
 */
export async function loadSkillGroups(): Promise<SkillGroupOption[]> {
  const skills = await skillRepo.all();
  const saved = await SkillGroup.find().sort({ createdAt: 1 }).lean();

  const groups = new Map<string, SkillGroupOption>(); // keyed case-insensitively
  for (const { group } of skills) {
    if (!group) continue;
    const found = groups.get(group.toLowerCase());
    if (found) {
      found.count += 1;
    } else {
      groups.set(group.toLowerCase(), { name: group, count: 1 });
    }
  }
  for (const { name } of saved) {
    if (!groups.has(name.toLowerCase())) {
      groups.set(name.toLowerCase(), { name, count: 0 });
    }
  }
  return [...groups.values()];
}

/** Like loadSkillGroups, but an empty list instead of an error (for form dropdowns). */
export async function listSkillGroups(): Promise<SkillGroupOption[]> {
  try {
    return await loadSkillGroups();
  } catch {
    return [];
  }
}
