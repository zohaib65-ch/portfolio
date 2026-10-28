import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

// There's no dashboard: /admin just opens the first section.
export default async function AdminIndexPage() {
  await requireAdmin();
  redirect("/admin/work");
}
