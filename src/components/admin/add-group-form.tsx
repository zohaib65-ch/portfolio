"use client";

import { Loader2, Plus } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { createSkillGroup } from "@/app/admin/actions/skill-groups";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddGroupForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createSkillGroup(name);
      if (result.name) {
        setName("");
      } else {
        setError(result.error ?? "Couldn't add the group.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 flex max-w-md flex-col gap-1.5">
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          placeholder="New group name, e.g. Mobile"
          aria-label="New group name"
          autoComplete="off"
        />
        <Button type="submit" disabled={pending || !name.trim()} className="shrink-0">
          {pending ? (
            <Loader2 className="mr-1 size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="mr-1 size-4" aria-hidden />
          )}
          Add group
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
