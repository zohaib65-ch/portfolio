/* eslint-disable @next/next/no-img-element */
"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { uploadImage } from "@/app/admin/actions/images";
import { Field } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_IMAGE_TYPES,
  IMAGE_ACCEPT_ATTR,
  MAX_IMAGE_BYTES,
} from "@/lib/image-config";
import { cn } from "@/lib/utils";

/**
 * Picks an image from the computer. The file is uploaded as soon as it's
 * chosen and the form submits the resulting URL under `name`, so saving an
 * entry works exactly as it did when this was a text box.
 */
export function ImageField({
  name,
  label,
  hint,
  initialValue,
  error,
  shape = "square",
}: {
  name: string;
  label: string;
  hint?: string;
  initialValue: string;
  error?: string;
  shape?: "square" | "wide";
}) {
  const [value, setValue] = useState(initialValue);
  const [problem, setProblem] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = `${name}-file`;

  function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // lets the same file be picked again later
    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setProblem(`That image is too large. The limit is ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`);
      return;
    }
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setProblem("Unsupported file. Use PNG, JPEG, WEBP or GIF.");
      return;
    }

    setProblem(null);
    startUpload(async () => {
      const body = new FormData();
      body.set("file", file);
      const result = await uploadImage(body);
      if (result.url) {
        setValue(result.url);
      } else {
        setProblem(result.error ?? "Upload failed.");
      }
    });
  }

  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error}>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "relative flex flex-none items-center justify-center overflow-hidden rounded-lg border bg-muted",
            shape === "wide" ? "h-28 w-48" : "size-20"
          )}
        >
          {value ? (
            <img
              src={value}
              alt=""
              className={cn(
                "size-full",
                shape === "wide" ? "object-cover" : "object-contain p-1"
              )}
            />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="size-5 animate-spin" aria-label="Uploading" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={IMAGE_ACCEPT_ATTR}
            onChange={onPick}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="mr-1 size-4" aria-hidden />
              {value ? "Replace image" : "Upload image"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={() => {
                  setValue("");
                  setProblem(null);
                }}
              >
                <Trash2 className="mr-1 size-4" aria-hidden />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPEG, WEBP or GIF, up to {MAX_IMAGE_BYTES / 1024 / 1024} MB.
          </p>
          {problem && (
            <p role="alert" className="text-xs text-destructive">
              {problem}
            </p>
          )}
        </div>
      </div>
    </Field>
  );
}
