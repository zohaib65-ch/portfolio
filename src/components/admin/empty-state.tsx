import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  noun,
  singular,
  newHref,
}: {
  noun: string;
  singular: string;
  newHref: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
      <p className="font-medium">No {noun} yet</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        The live site hides this section until you add an entry.
      </p>
      <Button asChild size="sm">
        <Link href={newHref}>
          <Plus className="mr-1 size-4" aria-hidden />
          Add {singular}
        </Link>
      </Button>
    </div>
  );
}
