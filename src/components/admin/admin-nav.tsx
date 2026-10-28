"use client";

import { Briefcase, FolderKanban, Sparkles, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/work", label: "Work Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/groups", label: "Skill Groups", icon: Tags },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
