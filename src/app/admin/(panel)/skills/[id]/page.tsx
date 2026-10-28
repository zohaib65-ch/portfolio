import { notFound } from "next/navigation";
import { saveSkill } from "@/app/admin/actions/content";
import { DbError } from "@/components/admin/db-error";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { requireAdmin } from "@/lib/auth";
import { listSkillGroups, skillRepo } from "@/lib/content";
import type { SkillItem } from "@/lib/types";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  let item: SkillItem | null;
  try {
    item = await skillRepo.byId(id);
  } catch (error) {
    console.error("[admin] loading skill failed", error);
    return <DbError />;
  }
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit ${item.name}`} />
      <SkillForm
        action={saveSkill.bind(null, item.id)}
        initial={item}
        groups={await listSkillGroups()}
      />
    </>
  );
}
