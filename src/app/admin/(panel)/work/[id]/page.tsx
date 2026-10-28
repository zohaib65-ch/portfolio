import { notFound } from "next/navigation";
import { saveWork } from "@/app/admin/actions/content";
import { DbError } from "@/components/admin/db-error";
import { PageHeader } from "@/components/admin/page-header";
import { WorkForm } from "@/components/admin/work-form";
import { requireAdmin } from "@/lib/auth";
import { workRepo } from "@/lib/content";
import type { WorkItem } from "@/lib/types";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  let item: WorkItem | null;
  try {
    item = await workRepo.byId(id);
  } catch (error) {
    console.error("[admin] loading work failed", error);
    return <DbError />;
  }
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit ${item.company}`} />
      <WorkForm action={saveWork.bind(null, item.id)} initial={item} />
    </>
  );
}
