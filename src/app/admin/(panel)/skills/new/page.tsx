import { saveSkill } from "@/app/admin/actions/content";
import { PageHeader } from "@/components/admin/page-header";
import { SkillForm } from "@/components/admin/skill-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewSkillPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Add skill" />
      <SkillForm action={saveSkill.bind(null, null)} />
    </>
  );
}
