"use client";

import { useActionState } from "react";
import { Field } from "@/components/admin/field";
import {
  FormError,
  FormFooter,
  VisibleCheckbox,
} from "@/components/admin/form-footer";
import { ImageField } from "@/components/admin/image-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/form-state";
import { SKILL_ICONS, SKILL_ICON_KEYS } from "@/lib/skill-icons";
import type { SkillItem } from "@/lib/types";

type TextKey = "name" | "icon" | "iconUrl" | "group";

export function SkillForm({
  action,
  initial,
  groups = [],
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: SkillItem;
  /** Existing group names, offered as suggestions. */
  groups?: string[];
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  const value = (key: TextKey) =>
    (state.values?.[key] as string | undefined) ?? initial?.[key] ?? "";
  const visible = state.values
    ? Boolean(state.values.visible)
    : (initial?.visible ?? true);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <FormError message={state.error} />

      <Field label="Name" htmlFor="name" error={errors.name} required>
        <Input
          id="name"
          name="name"
          defaultValue={value("name")}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoComplete="off"
          required
        />
      </Field>

      <Field
        label="Group"
        htmlFor="group"
        error={errors.group}
        hint="Optional heading this skill is listed under on the site, e.g. Frontend or Databases."
      >
        <Input
          id="group"
          name="group"
          list="skill-groups"
          defaultValue={value("group")}
          aria-invalid={Boolean(errors.group) || undefined}
          aria-describedby={errors.group ? "group-error" : undefined}
          autoComplete="off"
        />
        <datalist id="skill-groups">
          {groups.map((group) => (
            <option key={group} value={group} />
          ))}
        </datalist>
      </Field>

      <Field label="Icon" htmlFor="icon" error={errors.icon}>
        <select
          id="icon"
          name="icon"
          defaultValue={value("icon")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">No icon</option>
          {SKILL_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {SKILL_ICONS[key].label}
            </option>
          ))}
        </select>
      </Field>

      <ImageField
        name="iconUrl"
        label="Custom icon"
        hint="Optional. Used when no built-in icon is selected above. A small square image works best."
        initialValue={value("iconUrl")}
        error={errors.iconUrl}
      />

      <VisibleCheckbox defaultChecked={visible} />
      <FormFooter
        cancelHref="/admin/skills"
        submitLabel={initial ? "Save changes" : "Add skill"}
      />
    </form>
  );
}
