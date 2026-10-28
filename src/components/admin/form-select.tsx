"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FormSelectOption = {
  value: string;
  label: string;
};

// Radix doesn't allow an item with an empty value, so "nothing selected" is
// represented by this placeholder inside the component and submitted as "".
const NONE = "__none__";

/**
 * shadcn Select for use inside a plain <form>: it submits the chosen value
 * under `name` (and "" when `noneLabel` is chosen) via a hidden input.
 */
export function FormSelect({
  id,
  name,
  value,
  onValueChange,
  options,
  noneLabel,
  invalid,
}: {
  id: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  options: FormSelectOption[];
  /** Label of the "nothing selected" entry. */
  noneLabel: string;
  invalid?: boolean;
}) {
  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Select
        value={value === "" ? NONE : value}
        onValueChange={(next) => onValueChange(next === NONE ? "" : next)}
      >
        <SelectTrigger id={id} aria-invalid={invalid || undefined}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>{noneLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
