import { Briefcase, FolderKanban, Sparkles } from "lucide-react";
import Link from "next/link";
import { DbError } from "@/components/admin/db-error";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { projectRepo, skillRepo, workRepo } from "@/lib/content";

async function loadCounts() {
  try {
    const [work, skills, projects] = await Promise.all([
      workRepo.all(),
      skillRepo.all(),
      projectRepo.all(),
    ]);
    const count = (items: { visible: boolean }[]) => ({
      total: items.length,
      hidden: items.filter((item) => !item.visible).length,
    });
    return { work: count(work), skills: count(skills), projects: count(projects) };
  } catch (error) {
    console.error("[admin] dashboard query failed", error);
    return null;
  }
}

export default async function DashboardPage() {
  await requireAdmin();
  const counts = await loadCounts();

  const cards = counts && [
    { href: "/admin/work", label: "Work experience", icon: Briefcase, ...counts.work },
    { href: "/admin/skills", label: "Skills", icon: Sparkles, ...counts.skills },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban, ...counts.projects },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything here is stored in MongoDB and shown on your public site."
      />

      {!cards ? (
        <DbError />
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map(({ href, label, icon: Icon, total, hidden }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col gap-3 rounded-xl border p-5 transition-colors hover:bg-accent/40"
              >
                <Icon className="size-5 text-muted-foreground" aria-hidden />
                <div>
                  <p className="text-3xl font-semibold tabular-nums">{total}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
                {hidden > 0 && (
                  <p className="text-xs text-muted-foreground">{hidden} hidden</p>
                )}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/work/new">Add experience</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/skills/new">Add skill</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/projects/new">Add project</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
