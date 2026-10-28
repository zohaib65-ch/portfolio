import { AddGroupForm } from "@/components/admin/add-group-form";
import { DbError } from "@/components/admin/db-error";
import { GroupRow } from "@/components/admin/group-row";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { loadSkillGroups } from "@/lib/content";
import type { SkillGroupOption } from "@/lib/types";

export default async function GroupsPage() {
  await requireAdmin();

  let groups: SkillGroupOption[];
  try {
    groups = await loadSkillGroups();
  } catch (error) {
    console.error("[admin] listing skill groups failed", error);
    return (
      <>
        <PageHeader title="Skill Groups" />
        <DbError />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Skill Groups"
        description="The headings your skills are listed under on the site. They appear in the order of their first skill, so reorder skills in Skills to reorder groups."
      />

      <AddGroupForm />

      {groups.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No groups yet. Add one above, then pick it when adding or editing a skill.
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {groups.map((group) => (
            <GroupRow key={group.name} name={group.name} count={group.count} />
          ))}
        </ul>
      )}
    </>
  );
}
