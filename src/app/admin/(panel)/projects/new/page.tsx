import { saveProject } from "@/app/admin/actions/content";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Add project" />
      <ProjectForm action={saveProject.bind(null, null)} />
    </>
  );
}
