import { Plus } from "lucide-react";
import Link from "next/link";
import { DbError } from "@/components/admin/db-error";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { projectRepo } from "@/lib/content";
import type { ProjectItem } from "@/lib/types";

export default async function ProjectsListPage() {
  await requireAdmin();

  let items: ProjectItem[];
  try {
    items = await projectRepo.all();
  } catch (error) {
    console.error("[admin] listing projects failed", error);
    return (
      <>
        <PageHeader title="Projects" />
        <DbError />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="Newest first. New projects are added to the top; use the arrows to reorder."
        action={
          <Button asChild size="sm">
            <Link href="/admin/projects/new">
              <Plus className="mr-1 size-4" aria-hidden />
              Add project
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          noun="projects"
          singular="project"
          newHref="/admin/projects/new"
        />
      ) : (
        <ul className="divide-y rounded-xl border">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium">
                  <span className="truncate">{item.title}</span>
                  {!item.visible && <Badge variant="secondary">Hidden</Badge>}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {[item.dates, item.technologies.slice(0, 4).join(", ")]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <RowActions
                resource="projects"
                id={item.id}
                name={item.title}
                visible={item.visible}
                isFirst={index === 0}
                isLast={index === items.length - 1}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
