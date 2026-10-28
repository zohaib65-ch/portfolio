"use client";

import { useActionState, useState } from "react";
import { Field } from "@/components/admin/field";
import {
  FormError,
  FormFooter,
  VisibleCheckbox,
} from "@/components/admin/form-footer";
import { FormSelect } from "@/components/admin/form-select";
import { GroupField } from "@/components/admin/group-field";
import { ImageField } from "@/components/admin/image-field";
import { Input } from "@/components/ui/input";
import type { FormState } from "@/lib/form-state";
import { SKILL_ICONS, SKILL_ICON_KEYS } from "@/lib/skill-icons";
import type { SkillGroupOption, SkillItem } from "@/lib/types";

type TextKey = "name" | "icon" | "iconUrl" | "group";

export function SkillForm({
  action,
  initial,
  groups = [],
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: SkillItem;
  /** Groups offered in the dropdown. */
  groups?: SkillGroupOption[];
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  const value = (key: TextKey) =>
    (state.values?.[key] as string | undefined) ?? initial?.[key] ?? "";
  const [icon, setIcon] = useState(value("icon"));
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

      <GroupField
        name="group"
        initialValue={value("group")}
        groups={groups}
        error={errors.group}
      />

      <Field label="Icon" htmlFor="icon" error={errors.icon}>
        <FormSelect
          id="icon"
          name="icon"
          value={icon}
          onValueChange={setIcon}
          noneLabel="No icon"
          invalid={Boolean(errors.icon)}
          options={SKILL_ICON_KEYS.map((key) => {
            const Icon = SKILL_ICONS[key].component;
            return {
              value: key,
              label: SKILL_ICONS[key].label,
              icon: <Icon className="size-4 shrink-0" />,
            };
          })}
        />
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
