"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deleteItem,
  moveItem,
  toggleVisibility,
} from "@/app/admin/actions/content";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/form-state";
import type { ResourceKey } from "@/lib/types";

export function RowActions({
  resource,
  id,
  name,
  visible,
  isFirst,
  isLast,
}: {
  resource: ResourceKey;
  id: string;
  /** Used in accessible labels, e.g. "Move Shopify up". */
  name: string;
  visible: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      setError(result.error ?? null);
      setConfirming(false);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={pending || isFirst}
          aria-label={`Move ${name} up`}
          onClick={() => run(() => moveItem(resource, id, "up"))}
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={pending || isLast}
          aria-label={`Move ${name} down`}
          onClick={() => run(() => moveItem(resource, id, "down"))}
        >
          <ArrowDown className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={pending}
          aria-label={visible ? `Hide ${name}` : `Show ${name}`}
          title={visible ? "Hide from site" : "Show on site"}
          onClick={() => run(() => toggleVisibility(resource, id))}
        >
          {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="size-8 p-0"
        >
          <Link href={`/admin/${resource}/${id}`} aria-label={`Edit ${name}`}>
            <Pencil className="size-4" />
          </Link>
        </Button>
        {confirming ? (
          <>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={pending}
              onClick={() => run(() => deleteItem(resource, id))}
            >
              Delete {name}?
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-8 p-0 text-muted-foreground hover:text-destructive"
            disabled={pending}
            aria-label={`Delete ${name}`}
            onClick={() => setConfirming(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
