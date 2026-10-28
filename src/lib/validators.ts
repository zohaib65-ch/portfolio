import { z } from "zod";

// Anything stored here ends up in an href or src on the public site, so only
// allow http(s) URLs and site-relative paths. This rules out javascript: and
// data: URLs.
function isSafeUrl(value: string) {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const URL_MESSAGE = "Must start with https://, http:// or /";

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) =>
  z.string().trim().min(1, "Required").max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || isSafeUrl(value), URL_MESSAGE);
const requiredUrl = z
  .string()
  .trim()
  .min(1, "Required")
  .max(2048)
  .refine(isSafeUrl, URL_MESSAGE);

export const workSchema = z.object({
  company: required(120),
  title: required(120),
  href: optionalUrl,
  location: text(120),
  logoUrl: optionalUrl,
  start: required(40),
  end: text(40),
  description: text(4000),
  visible: z.boolean(),
});

export const skillSchema = z.object({
  name: required(60),
  iconUrl: optionalUrl,
  group: text(40),
  visible: z.boolean(),
});

export const projectSchema = z.object({
  title: required(120),
  href: optionalUrl,
  dates: text(80),
  description: text(2000),
  technologies: z
    .string()
    .transform((value) =>
      value
        .split(/[,\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().max(40, "Tags must be 40 characters or fewer")).max(30)),
  links: z
    .array(z.object({ label: required(40), href: requiredUrl }))
    .max(10, "At most 10 links"),
  image: optionalUrl,
  video: optionalUrl,
  visible: z.boolean(),
});

/** First message per field, keyed by dotted path (e.g. `links.0.href`). */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return errors;
}
