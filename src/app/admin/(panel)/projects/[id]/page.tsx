import { notFound } from "next/navigation";
import { saveProject } from "@/app/admin/actions/content";
import { DbError } from "@/components/admin/db-error";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";
import { projectRepo } from "@/lib/content";
import type { ProjectItem } from "@/lib/types";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  let item: ProjectItem | null;
  try {
    item = await projectRepo.byId(id);
  } catch (error) {
    console.error("[admin] loading project failed", error);
    return <DbError />;
  }
  if (!item) notFound();

  return (
    <>
      <PageHeader title={`Edit ${item.title}`} />
      <ProjectForm action={saveProject.bind(null, item.id)} initial={item} />
    </>
  );
}
