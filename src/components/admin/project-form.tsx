"use client";

import { Plus, X } from "lucide-react";
import { useActionState, useState } from "react";
import { Field } from "@/components/admin/field";
import {
  FormError,
  FormFooter,
  VisibleCheckbox,
} from "@/components/admin/form-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/form-state";
import type { ProjectItem, ProjectLink } from "@/lib/types";

type TextKey = "title" | "href" | "dates" | "description" | "image" | "video";

type LinkRow = ProjectLink & { key: number };

// Stable React keys for the link rows, so removing one doesn't shift the
// inputs of the rows after it.
let nextLinkKey = 0;
const withKey = (link: ProjectLink): LinkRow => ({ ...link, key: nextLinkKey++ });

export function ProjectForm({
  action,
  initial,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  initial?: ProjectItem;
}) {
  const [state, formAction] = useActionState(action, {});
  const errors = state.fieldErrors ?? {};

  const value = (key: TextKey) =>
    (state.values?.[key] as string | undefined) ?? initial?.[key] ?? "";
  const technologies =
    (state.values?.technologies as string | undefined) ??
    initial?.technologies.join(", ") ??
    "";
  const visible = state.values
    ? Boolean(state.values.visible)
    : (initial?.visible ?? true);

  const [links, setLinks] = useState<LinkRow[]>(() =>
    (
      (state.values?.links as ProjectLink[] | undefined) ??
      initial?.links ??
      []
    ).map(withKey)
  );

  const isBlank = (row: LinkRow) => row.label.trim() === "" && row.href.trim() === "";

  // The server validates links with blank rows dropped, so its error paths
  // index into the non-blank rows.
  function linkError(rowIndex: number, field: "label" | "href") {
    if (isBlank(links[rowIndex])) return undefined;
    const serverIndex = links.slice(0, rowIndex).filter((row) => !isBlank(row)).length;
    return errors[`links.${serverIndex}.${field}`];
  }

  function updateLink(key: number, patch: Partial<ProjectLink>) {
    setLinks((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <FormError message={state.error} />

      <Field label="Title" htmlFor="title" error={errors.title} required>
        <Input
          id="title"
          name="title"
          defaultValue={value("title")}
          aria-invalid={Boolean(errors.title) || undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
          autoComplete="off"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Project URL"
          htmlFor="href"
          error={errors.href}
          hint="Where the card and its arrow link to."
        >
          <Input
            id="href"
            name="href"
            inputMode="url"
            placeholder="https://"
            defaultValue={value("href")}
            aria-invalid={Boolean(errors.href) || undefined}
            aria-describedby={errors.href ? "href-error" : undefined}
          />
        </Field>
        <Field label="Dates" htmlFor="dates" error={errors.dates} hint="e.g. Jan 2024 - Present">
          <Input
            id="dates"
            name="dates"
            defaultValue={value("dates")}
            aria-invalid={Boolean(errors.dates) || undefined}
            aria-describedby={errors.dates ? "dates-error" : undefined}
            autoComplete="off"
          />
        </Field>
      </div>

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description}
        hint="Markdown is supported."
      >
        <Textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={value("description")}
          aria-invalid={Boolean(errors.description) || undefined}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
      </Field>

      <Field
        label="Technologies"
        htmlFor="technologies"
        error={errors.technologies}
        hint="Comma separated, e.g. Next.js, TypeScript, MongoDB"
      >
        <Input
          id="technologies"
          name="technologies"
          defaultValue={technologies}
          aria-invalid={Boolean(errors.technologies) || undefined}
          aria-describedby={errors.technologies ? "technologies-error" : undefined}
          autoComplete="off"
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1.5 text-sm font-medium">Badge links</legend>
        <p className="-mt-1 text-xs text-muted-foreground">
          Small buttons shown over the project image, such as Website or Source.
        </p>
        {links.map((row, index) => {
          const labelError = linkError(index, "label");
          const hrefError = linkError(index, "href");
          return (
            <div key={row.key} className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <Input
                  name="linkLabel"
                  value={row.label}
                  onChange={(event) => updateLink(row.key, { label: event.target.value })}
                  placeholder="Label (Website)"
                  aria-label={`Link ${index + 1} label`}
                  aria-invalid={Boolean(labelError) || undefined}
                  className="w-1/3"
                  autoComplete="off"
                />
                <Input
                  name="linkHref"
                  value={row.href}
                  onChange={(event) => updateLink(row.key, { href: event.target.value })}
                  placeholder="https://"
                  aria-label={`Link ${index + 1} URL`}
                  aria-invalid={Boolean(hrefError) || undefined}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="size-9 shrink-0 p-0"
                  aria-label={`Remove link ${index + 1}`}
                  onClick={() => setLinks((rows) => rows.filter((r) => r.key !== row.key))}
                >
                  <X className="size-4" />
                </Button>
              </div>
              {(labelError || hrefError) && (
                <p role="alert" className="text-xs text-destructive">
                  {labelError ?? hrefError}
                </p>
              )}
            </div>
          );
        })}
        {errors.links && (
          <p role="alert" className="text-xs text-destructive">
            {errors.links}
          </p>
        )}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setLinks((rows) => [...rows, withKey({ label: "", href: "" })])
            }
          >
            <Plus className="mr-1 size-4" aria-hidden />
            Add link
          </Button>
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Image URL"
          htmlFor="image"
          error={errors.image}
          hint="Full URL, or a file in /public."
        >
          <Input
            id="image"
            name="image"
            defaultValue={value("image")}
            aria-invalid={Boolean(errors.image) || undefined}
            aria-describedby={errors.image ? "image-error" : undefined}
          />
        </Field>
        <Field
          label="Video URL"
          htmlFor="video"
          error={errors.video}
          hint="An .mp4 link. Replaces the image when set."
        >
          <Input
            id="video"
            name="video"
            defaultValue={value("video")}
            aria-invalid={Boolean(errors.video) || undefined}
            aria-describedby={errors.video ? "video-error" : undefined}
          />
        </Field>
      </div>

      <VisibleCheckbox defaultChecked={visible} />
      <FormFooter
        cancelHref="/admin/projects"
        submitLabel={initial ? "Save changes" : "Add project"}
      />
    </form>
  );
}
