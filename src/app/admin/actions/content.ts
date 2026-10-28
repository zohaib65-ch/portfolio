"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import type { ActionResult, FormState } from "@/lib/form-state";
import { isObjectId } from "@/lib/ids";
import { confirmImages, deleteImages } from "@/lib/images";
import type { ResourceKey } from "@/lib/types";
import {
  fieldErrors,
  projectSchema,
  skillSchema,
  workSchema,
} from "@/lib/validators";
import { RESOURCE_KEYS, getModel } from "@/models";

const SAVE_ERROR = "Couldn't save. Check the database connection and try again.";

function str(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function revalidateSite() {
  revalidatePath("/");
}

async function nextOrder(resource: ResourceKey, place: "top" | "bottom") {
  const model = getModel(resource);
  const edge = await model
    .findOne()
    .sort({ order: place === "top" ? 1 : -1 })
    .select("order")
    .lean();
  if (!edge) return 0;
  return place === "top" ? edge.order - 1 : edge.order + 1;
}

// Fields that hold an image URL, per resource. An uploaded image lives in
// MongoDB and is referenced as /api/images/<id>.
const IMAGE_FIELDS: Record<ResourceKey, string[]> = {
  work: ["logoUrl"],
  skills: ["iconUrl"],
  projects: ["image"],
};

/**
 * After a save: make this entry's uploads permanent and delete the ones it no
 * longer uses (replaced or removed). Never fails the save itself.
 */
async function syncImages(
  resource: ResourceKey,
  before: { get(path: string): unknown } | null,
  after: Record<string, unknown>
) {
  try {
    const fields = IMAGE_FIELDS[resource];
    await confirmImages(fields.map((field) => after[field]));
    await deleteImages(
      fields
        .map((field) => before?.get(field))
        .filter((previous, index) => previous && previous !== after[fields[index]])
    );
  } catch (error) {
    console.error(`[admin] image cleanup for ${resource} failed`, error);
  }
}

async function persist(
  resource: ResourceKey,
  id: string | null,
  data: object,
  place: "top" | "bottom"
): Promise<string | null> {
  try {
    await connectDb();
    const model = getModel(resource);
    if (id) {
      if (!isObjectId(id)) return "Invalid entry.";
      const before = await model.findByIdAndUpdate(id, data);
      if (!before) return "That entry no longer exists.";
      await syncImages(resource, before, data as Record<string, unknown>);
    } else {
      await model.create({ ...data, order: await nextOrder(resource, place) });
      await syncImages(resource, null, data as Record<string, unknown>);
    }
    return null;
  } catch (error) {
    console.error(`[admin] saving ${resource} failed`, error);
    return SAVE_ERROR;
  }
}

// ---------------------------------------------------------------------------
// Create / update. `id` is bound by the page (`saveWork.bind(null, id)`), null
// for a new entry. New work and projects go to the top (newest first), new
// skills to the end.
// ---------------------------------------------------------------------------

export async function saveWork(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const values = {
    company: str(formData, "company"),
    title: str(formData, "title"),
    href: str(formData, "href"),
    location: str(formData, "location"),
    logoUrl: str(formData, "logoUrl"),
    start: str(formData, "start"),
    end: str(formData, "end"),
    description: str(formData, "description"),
    visible: formData.has("visible"),
  };
  const parsed = workSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const error = await persist("work", id, parsed.data, "top");
  if (error) return { error, values };

  revalidateSite();
  redirect("/admin/work");
}

export async function saveSkill(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const values = {
    name: str(formData, "name"),
    icon: str(formData, "icon"),
    iconUrl: str(formData, "iconUrl"),
    visible: formData.has("visible"),
  };
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const error = await persist("skills", id, parsed.data, "bottom");
  if (error) return { error, values };

  revalidateSite();
  redirect("/admin/skills");
}

export async function saveProject(
  id: string | null,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const labels = formData.getAll("linkLabel").map(String);
  const hrefs = formData.getAll("linkHref").map(String);
  const links = labels
    .map((label, index) => ({ label, href: hrefs[index] ?? "" }))
    .filter((link) => link.label.trim() !== "" || link.href.trim() !== "");

  const values = {
    title: str(formData, "title"),
    href: str(formData, "href"),
    dates: str(formData, "dates"),
    description: str(formData, "description"),
    technologies: str(formData, "technologies"),
    links,
    image: str(formData, "image"),
    video: str(formData, "video"),
    visible: formData.has("visible"),
  };
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const error = await persist("projects", id, parsed.data, "top");
  if (error) return { error, values };

  revalidateSite();
  redirect("/admin/projects");
}

// ---------------------------------------------------------------------------
// List actions shared by all three resources
// ---------------------------------------------------------------------------

function parseTarget(resource: string, id: string) {
  const valid = (RESOURCE_KEYS as readonly string[]).includes(resource);
  return valid && isObjectId(id) ? (resource as ResourceKey) : null;
}

export async function moveItem(
  resource: ResourceKey,
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  await requireAdmin();
  if (!parseTarget(resource, id) || (direction !== "up" && direction !== "down")) {
    return { error: "Invalid request." };
  }

  try {
    await connectDb();
    const model = getModel(resource);
    const docs = await model
      .find()
      .sort({ order: 1, createdAt: 1, _id: 1 })
      .select("_id")
      .lean();

    const from = docs.findIndex((doc) => String(doc._id) === id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= docs.length) return {};

    [docs[from], docs[to]] = [docs[to], docs[from]];
    // Rewrite every position rather than swapping two values, so entries that
    // share an `order` (e.g. from manual edits in Atlas) still end up stable.
    await model.bulkWrite(
      docs.map((doc, index) => ({
        updateOne: { filter: { _id: doc._id }, update: { $set: { order: index } } },
      }))
    );
  } catch (error) {
    console.error(`[admin] reordering ${resource} failed`, error);
    return { error: "Couldn't reorder. Try again." };
  }

  revalidateSite();
  revalidatePath(`/admin/${resource}`);
  return {};
}

export async function toggleVisibility(
  resource: ResourceKey,
  id: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!parseTarget(resource, id)) return { error: "Invalid request." };

  try {
    await connectDb();
    const model = getModel(resource);
    const doc = await model.findById(id).select("visible");
    if (!doc) return { error: "That entry no longer exists." };
    doc.visible = !doc.visible;
    await doc.save();
  } catch (error) {
    console.error(`[admin] toggling ${resource} failed`, error);
    return { error: "Couldn't update. Try again." };
  }

  revalidateSite();
  revalidatePath(`/admin/${resource}`);
  return {};
}

export async function deleteItem(
  resource: ResourceKey,
  id: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!parseTarget(resource, id)) return { error: "Invalid request." };

  try {
    await connectDb();
    const removed = await getModel(resource).findByIdAndDelete(id);
    if (removed) {
      await deleteImages(IMAGE_FIELDS[resource].map((field) => removed.get(field)));
    }
  } catch (error) {
    console.error(`[admin] deleting ${resource} failed`, error);
    return { error: "Couldn't delete. Try again." };
  }

  revalidateSite();
  revalidatePath(`/admin/${resource}`);
  return {};
}
