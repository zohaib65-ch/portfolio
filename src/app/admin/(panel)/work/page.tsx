/* eslint-disable @next/next/no-img-element */
import { Plus } from "lucide-react";
import Link from "next/link";
import { DbError } from "@/components/admin/db-error";
import { EmptyState } from "@/components/admin/empty-state";
import { PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { workRepo } from "@/lib/content";
import type { WorkItem } from "@/lib/types";

export default async function WorkListPage() {
  await requireAdmin();

  let items: WorkItem[];
  try {
    items = await workRepo.all();
  } catch (error) {
    console.error("[admin] listing work failed", error);
    return (
      <>
        <PageHeader title="Work Experience" />
        <DbError />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Work Experience"
        description="Newest first. New entries are added to the top; use the arrows to reorder."
        action={
          <Button asChild size="sm">
            <Link href="/admin/work/new">
              <Plus className="mr-1 size-4" aria-hidden />
              Add experience
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          noun="work experience"
          singular="experience"
          newHref="/admin/work/new"
        />
      ) : (
        <ul className="divide-y rounded-xl border">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt=""
                    className="size-10 flex-none rounded-full border object-contain p-1"
                  />
                ) : (
                  <div className="size-10 flex-none rounded-full border bg-muted" />
                )}
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate">{item.company}</span>
                    {!item.visible && <Badge variant="secondary">Hidden</Badge>}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.title} · {item.start} – {item.end || "Present"}
                  </p>
                </div>
              </div>
              <RowActions
                resource="work"
                id={item.id}
                name={item.company}
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
