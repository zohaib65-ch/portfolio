"use client";

import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState, useTransition, type KeyboardEvent } from "react";
import {
  deleteSkillGroup,
  renameSkillGroup,
  type GroupResult,
} from "@/app/admin/actions/skill-groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GroupRow({ name, count }: { name: string; count: number }) {
  const [mode, setMode] = useState<"view" | "rename" | "delete">("view");
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const skills = count === 1 ? "1 skill" : `${count} skills`;

  function run(action: () => Promise<GroupResult>) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setMode("view");
      }
    });
  }

  function startRename() {
    setDraft(name);
    setError(null);
    setMode("rename");
  }

  function cancel() {
    setError(null);
    setMode("view");
  }

  function onRenameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      run(() => renameSkillGroup(name, draft));
    } else if (event.key === "Escape") {
      cancel();
    }
  }

  return (
    <li className="flex flex-col gap-2 p-4">
      {mode === "rename" ? (
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onRenameKeyDown}
            maxLength={40}
            aria-label={`New name for ${name}`}
            autoComplete="off"
            autoFocus
            className="max-w-xs"
          />
          <Button
            type="button"
            size="sm"
            disabled={pending || !draft.trim()}
            onClick={() => run(() => renameSkillGroup(name, draft))}
          >
            <Check className="mr-1 size-4" aria-hidden />
            Save
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={cancel}>
            <X className="mr-1 size-4" aria-hidden />
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {count === 0 ? "No skills yet" : skills}
            </p>
          </div>

          {mode === "delete" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {count > 0
                  ? `Delete this group? ${skills} will move to "No group".`
                  : "Delete this group?"}
              </span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={pending}
                onClick={() => run(() => deleteSkillGroup(name))}
              >
                Delete
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={cancel}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0"
                aria-label={`Rename ${name}`}
                onClick={startRename}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-muted-foreground hover:text-destructive"
                aria-label={`Delete ${name}`}
                onClick={() => {
                  setError(null);
                  setMode("delete");
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </li>
  );
}
