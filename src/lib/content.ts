import type { Model, Types } from "mongoose";
import { DATA } from "@/data/resume";
import { connectDb, isDbConfigured } from "@/lib/db";
import { isObjectId } from "@/lib/ids";
import { findSkillIconKey } from "@/lib/skill-icons";
import type { ProjectItem, SkillItem, WorkItem } from "@/lib/types";
import {
  Project,
  Skill,
  WorkExperience,
  type Orderable,
} from "@/models";
import type { ProjectDoc } from "@/models/project";
import type { SkillDoc } from "@/models/skill";
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
    icon: findSkillIconKey(skill.icon),
    iconUrl: "",
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
