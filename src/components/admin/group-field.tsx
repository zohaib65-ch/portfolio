"use client";

import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition, type KeyboardEvent } from "react";
import { createSkillGroup } from "@/app/admin/actions/skill-groups";
import { Field } from "@/components/admin/field";
import { FormSelect } from "@/components/admin/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SkillGroupOption } from "@/lib/types";

const MAX_LENGTH = 40;

/**
 * Dropdown of skill groups, with a dialog for adding new ones. Groups added in
 * the dialog are saved straight away, so they stay in the list even if this
 * skill isn't saved. Renaming and removing groups happens on the Skill Groups
 * page.
 */
export function GroupField({
  name,
  initialValue,
  groups,
  error,
}: {
  name: string;
  initialValue: string;
  groups: SkillGroupOption[];
  error?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [added, setAdded] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The saved groups, anything added here, and always the current value.
  const names = [
    ...new Set([...groups.map((group) => group.name), ...added, ...(value ? [value] : [])]),
  ];

  function openDialog() {
    setProblem(null);
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function addGroup() {
    setProblem(null);
    startTransition(async () => {
      const result = await createSkillGroup(newName);
      if (!result.name) {
        setProblem(result.error ?? "Couldn't add the group.");
        return;
      }
      setAdded((current) => [...current, result.name as string]);
      setValue(result.name);
      setNewName("");
      closeDialog();
    });
  }

  // Enter would otherwise submit the whole skill form behind the dialog.
  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!busy) addGroup();
    }
  }

  return (
    <Field
      label="Group"
      htmlFor={name}
      error={error}
      hint="Optional heading this skill is listed under on the site, e.g. Frontend or Databases."
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <FormSelect
            id={name}
            name={name}
            value={value}
            onValueChange={setValue}
            noneLabel="No group"
            invalid={Boolean(error)}
            options={names.map((groupName) => ({ value: groupName, label: groupName }))}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 shrink-0"
          onClick={openDialog}
        >
          <Plus className="mr-1 size-4" aria-hidden />
          New group
        </Button>
      </div>
      <Link
        href="/admin/groups"
        className="w-fit text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Manage groups (rename or remove)
      </Link>

      {/* Closes on Esc, and on a click outside the box. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="new-group-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={() => {
          setNewName("");
          setProblem(null);
        }}
        className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-xl border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/40"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="new-group-title" className="text-lg font-semibold">
              Add a group
            </h2>
            <p className="text-sm text-muted-foreground">
              Groups are the headings your skills are listed under on the site.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-group-name" className="text-sm font-medium">
              Group name
            </label>
            <Input
              ref={inputRef}
              id="new-group-name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={onInputKeyDown}
              maxLength={MAX_LENGTH}
              placeholder="e.g. Mobile"
              autoComplete="off"
            />
            {problem && (
              <p role="alert" className="text-xs text-destructive">
                {problem}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="button" disabled={busy || !newName.trim()} onClick={addGroup}>
              {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />}
              Add group
            </Button>
          </div>
        </div>
      </dialog>
    </Field>
  );
}
