import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/admin/submit-button";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </div>
  );
}

export function FormFooter({
  cancelHref,
  submitLabel,
}: {
  cancelHref: string;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 border-t pt-6">
      <SubmitButton>{submitLabel}</SubmitButton>
      <Button asChild variant="ghost">
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}

export function VisibleCheckbox({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-start gap-3 rounded-md border p-3 text-sm">
      <input
        type="checkbox"
        name="visible"
        defaultChecked={defaultChecked}
        className="mt-0.5 size-4 accent-primary"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">Show on site</span>
        <span className="text-xs text-muted-foreground">
          Untick to hide this without deleting it.
        </span>
      </span>
    </label>
  );
}
