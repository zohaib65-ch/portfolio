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
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import type { WorkItem } from "@/lib/types";

type TextKey =
  | "company"
  | "title"
  | "href"
  | "location"
  | "logoUrl"
  | "start"
  | "end"
  | "description";

export function WorkForm({
  action,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: WorkItem;
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  // After a failed save the server echoes what was submitted; prefer that so
  // the form doesn't snap back to the stored values.
  const value = (key: TextKey) =>
    (state.values?.[key] as string | undefined) ?? initial?.[key] ?? "";
  const visible = state.values
    ? Boolean(state.values.visible)
    : (initial?.visible ?? true);

  const invalid = (key: TextKey) => Boolean(errors[key]) || undefined;

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <FormError message={state.error} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" htmlFor="company" error={errors.company} required>
          <Input
            id="company"
            name="company"
            defaultValue={value("company")}
            aria-invalid={invalid("company")}
            aria-describedby={errors.company ? "company-error" : undefined}
            autoComplete="off"
            required
          />
        </Field>
        <Field label="Job title" htmlFor="title" error={errors.title} required>
          <Input
            id="title"
            name="title"
            defaultValue={value("title")}
            aria-invalid={invalid("title")}
            aria-describedby={errors.title ? "title-error" : undefined}
            autoComplete="off"
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start" htmlFor="start" error={errors.start} hint="e.g. May 2021" required>
          <Input
            id="start"
            name="start"
            defaultValue={value("start")}
            aria-invalid={invalid("start")}
            aria-describedby={errors.start ? "start-error" : undefined}
            autoComplete="off"
            required
          />
        </Field>
        <Field label="End" htmlFor="end" error={errors.end} hint="Leave blank if this is your current role.">
          <Input
            id="end"
            name="end"
            defaultValue={value("end")}
            aria-invalid={invalid("end")}
            aria-describedby={errors.end ? "end-error" : undefined}
            autoComplete="off"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company website" htmlFor="href" error={errors.href}>
          <Input
            id="href"
            name="href"
            inputMode="url"
            placeholder="https://"
            defaultValue={value("href")}
            aria-invalid={invalid("href")}
            aria-describedby={errors.href ? "href-error" : undefined}
          />
        </Field>
        <Field label="Location" htmlFor="location" error={errors.location} hint="e.g. Remote">
          <Input
            id="location"
            name="location"
            defaultValue={value("location")}
            aria-invalid={invalid("location")}
            aria-describedby={errors.location ? "location-error" : undefined}
            autoComplete="off"
          />
        </Field>
      </div>

      <ImageField
        name="logoUrl"
        label="Company logo"
        initialValue={value("logoUrl")}
        error={errors.logoUrl}
      />

      <Field label="Description" htmlFor="description" error={errors.description}>
        <Textarea
          id="description"
          name="description"
          rows={6}
          defaultValue={value("description")}
          aria-invalid={invalid("description")}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
      </Field>

      <VisibleCheckbox defaultChecked={visible} />
      <FormFooter
        cancelHref="/admin/work"
        submitLabel={initial ? "Save changes" : "Add experience"}
      />
    </form>
  );
}
