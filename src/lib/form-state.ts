/** What a save action hands back to its form when it doesn't redirect. */
export type FormState = {
  /** Form-level problem (e.g. the database write failed). */
  error?: string;
  /** First message per field, keyed by name (`links.0.href` for nested). */
  fieldErrors?: Record<string, string>;
  /** Raw submitted values, so the form can repopulate after a failed save. */
  values?: Record<string, unknown>;
};

export type ActionResult = { error?: string };
