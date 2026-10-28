// Plain, serializable shapes shared by the public site and the admin panel.
// Optional text fields are empty strings (never undefined) so forms and
// components don't need to distinguish "missing" from "blank".

export type WorkItem = {
  id: string;
  company: string;
  title: string;
  href: string;
  location: string;
  logoUrl: string;
  start: string;
  /** Empty means "Present". */
  end: string;
  description: string;
  visible: boolean;
};

export type SkillItem = {
  id: string;
  name: string;
  /** Icon image URL (an uploaded image), or "" for none. */
  iconUrl: string;
  /** Heading the skill is listed under on the site, e.g. "Frontend". */
  group: string;
  visible: boolean;
};

export type ProjectLink = { label: string; href: string };

export type ProjectItem = {
  id: string;
  title: string;
  href: string;
  dates: string;
  /** Markdown. */
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
  visible: boolean;
};

/** A group offered in the skill form's dropdown. */
export type SkillGroupOption = {
  name: string;
  /** How many skills (hidden ones too) are listed under it. */
  count: number;
};

export type ResourceKey = "work" | "skills" | "projects";
