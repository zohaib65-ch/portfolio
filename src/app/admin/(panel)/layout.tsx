import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();

  return (
    <div className="md:grid md:min-h-dvh md:grid-cols-[230px_1fr]">
      <aside className="flex flex-col gap-4 border-b bg-card/50 p-4 md:sticky md:top-0 md:h-dvh md:border-r md:border-b-0">
        <div className="flex items-center justify-between gap-2 md:block">
          <p className="px-3 text-sm font-semibold tracking-tight">
            Portfolio admin
          </p>
          <div className="flex gap-1 md:hidden">
            <SessionLinks />
          </div>
        </div>
        <AdminNav />
        <div className="mt-auto hidden flex-col gap-1 md:flex">
          <SessionLinks />
        </div>
      </aside>
      <main className="w-full max-w-4xl p-6 md:p-10">{children}</main>
    </div>
  );
}

function SessionLinks() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="justify-start gap-2">
        <Link href="/" target="_blank">
          <ExternalLink className="size-4" aria-hidden />
          View site
        </Link>
      </Button>
      <form action={logoutAction}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </form>
    </>
  );
}
