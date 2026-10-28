import { saveWork } from "@/app/admin/actions/content";
import { PageHeader } from "@/components/admin/page-header";
import { WorkForm } from "@/components/admin/work-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewWorkPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Add work experience" />
      <WorkForm action={saveWork.bind(null, null)} />
    </>
  );
}
