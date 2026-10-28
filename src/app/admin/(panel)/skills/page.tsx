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
import { skillRepo } from "@/lib/content";
import type { SkillItem } from "@/lib/types";

export default async function SkillsListPage() {
  await requireAdmin();

  let items: SkillItem[];
  try {
    items = await skillRepo.all();
  } catch (error) {
    console.error("[admin] listing skills failed", error);
    return (
      <>
        <PageHeader title="Skills" />
        <DbError />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Skills"
        description="Shown in this order. New skills are added to the end."
        action={
          <Button asChild size="sm">
            <Link href="/admin/skills/new">
              <Plus className="mr-1 size-4" aria-hidden />
              Add skill
            </Link>
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState noun="skills" singular="skill" newHref="/admin/skills/new" />
      ) : (
        <ul className="divide-y rounded-xl border">
          {items.map((item, index) => {
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-8 flex-none items-center justify-center">
                    {item.iconUrl ? (
                      <img
                        src={item.iconUrl}
                        alt=""
                        className="size-5 overflow-hidden rounded object-contain"
                      />
                    ) : (
                      <div className="size-5 rounded bg-muted" />
                    )}
                  </div>
                  <p className="flex items-center gap-2 font-medium">
                    <span className="truncate">{item.name}</span>
                    {item.group && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {item.group}
                      </span>
                    )}
                    {!item.visible && <Badge variant="secondary">Hidden</Badge>}
                  </p>
                </div>
                <RowActions
                  resource="skills"
                  id={item.id}
                  name={item.name}
                  visible={item.visible}
                  isFirst={index === 0}
                  isLast={index === items.length - 1}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
