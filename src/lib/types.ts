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
  /** Key into SKILL_ICONS, or "" for none. */
  icon: string;
  /** Custom icon image, used when no built-in icon is selected. */
  iconUrl: string;
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

export type ResourceKey = "work" | "skills" | "projects";
