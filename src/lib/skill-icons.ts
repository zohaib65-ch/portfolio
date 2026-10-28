import type { ComponentType, SVGProps } from "react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Golang } from "@/components/ui/svgs/golang";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";

type SkillIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Skills are stored in MongoDB by key, since React components can't be
// serialized. Add an entry here to make a new icon available in the admin.
export const SKILL_ICONS = {
  react: { label: "React", component: ReactLight },
  nextjs: { label: "Next.js", component: NextjsIconDark },
  typescript: { label: "TypeScript", component: Typescript },
  nodejs: { label: "Node.js", component: Nodejs },
  python: { label: "Python", component: Python },
  golang: { label: "Go", component: Golang },
  postgresql: { label: "PostgreSQL", component: Postgresql },
  docker: { label: "Docker", component: Docker },
  kubernetes: { label: "Kubernetes", component: Kubernetes },
  java: { label: "Java", component: Java },
  csharp: { label: "C#", component: Csharp },
} satisfies Record<string, { label: string; component: SkillIconComponent }>;

type SkillIconKey = keyof typeof SKILL_ICONS;

export const SKILL_ICON_KEYS = Object.keys(SKILL_ICONS) as SkillIconKey[];

export function getSkillIcon(key: string): SkillIconComponent | undefined {
  return key in SKILL_ICONS
    ? SKILL_ICONS[key as SkillIconKey].component
    : undefined;
}

export function findSkillIconKey(component: unknown): SkillIconKey | "" {
  const match = SKILL_ICON_KEYS.find(
    (key) => SKILL_ICONS[key].component === component
  );
  return match ?? "";
}
