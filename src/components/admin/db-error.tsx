import { AlertTriangle } from "lucide-react";

export function DbError() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className="font-medium text-destructive">Can&apos;t reach MongoDB</p>
        <p className="text-muted-foreground">
          Check <code>MONGODB_URI</code> and, if you use Atlas, that this
          server&apos;s IP is in the network access list. The server log has the
          full error.
        </p>
      </div>
    </div>
  );
}
