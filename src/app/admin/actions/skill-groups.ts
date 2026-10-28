"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Skill } from "@/models";
import { SkillGroup } from "@/models/skill-group";

export type GroupResult = {
  name?: string;
  /** How many skills were moved to "No group" by a delete. */
  ungrouped?: number;
  error?: string;
};

const MAX_LENGTH = 40;

const clean = (value: unknown) =>
  (typeof value === "string" ? value : "").replace(/\s+/g, " ").trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Matches a group name regardless of letter case. */
const sameName = (name: string) => new RegExp(`^${escapeRegExp(name)}$`, "i");

function validateName(name: string) {
  if (!name) return "Enter a group name.";
  if (name.length > MAX_LENGTH) return `Use ${MAX_LENGTH} characters or fewer.`;
  return null;
}

function revalidateGroups() {
  revalidatePath("/"); // the public Skills headings
  revalidatePath("/admin/groups");
  revalidatePath("/admin/skills");
}

/**
 * Adds a group to the dropdown. If a group with that name already exists (in
 * any letter case) its existing spelling is returned instead.
 */
export async function createSkillGroup(input: string): Promise<GroupResult> {
  await requireAdmin();

  const name = clean(input);
  const invalid = validateName(name);
  if (invalid) return { error: invalid };

  try {
    await connectDb();

    const usedBySkill = await Skill.findOne({ group: sameName(name) } as never)
      .select("group")
      .lean<{ group: string }>();
    if (usedBySkill) return { name: usedBySkill.group };

    const key = name.toLowerCase();
    const existing = await SkillGroup.findOne({ key });
    if (existing) return { name: existing.name };

    try {
      await SkillGroup.create({ name, key });
    } catch (error) {
      // Two quick submits can race on the unique key; the group exists either way.
      const raced = await SkillGroup.findOne({ key });
      if (!raced) throw error;
      return { name: raced.name };
    }
    revalidatePath("/admin/groups");
    return { name };
  } catch (error) {
    console.error("[admin] creating skill group failed", error);
    return { error: "Couldn't add the group. Try again." };
  }
}

/** Renames a group everywhere: in the dropdown and on every skill that uses it. */
export async function renameSkillGroup(
  fromInput: string,
  toInput: string
): Promise<GroupResult> {
  await requireAdmin();

  const from = clean(fromInput);
  const to = clean(toInput);
  if (!from) return { error: "Invalid group." };
  const invalid = validateName(to);
  if (invalid) return { error: invalid };
  if (from === to) return { name: to };

  try {
    await connectDb();

    // Changing only the letter case is fine; taking another group's name is not.
    if (from.toLowerCase() !== to.toLowerCase()) {
      const taken =
        (await Skill.exists({ group: sameName(to) } as never)) ||
        (await SkillGroup.exists({ key: to.toLowerCase() }));
      if (taken) return { error: "A group with that name already exists." };
    }

    await Skill.updateMany({ group: sameName(from) } as never, { $set: { group: to } });
    const saved = await SkillGroup.findOne({ key: from.toLowerCase() });
    if (saved) {
      saved.name = to;
      saved.key = to.toLowerCase();
      await saved.save();
    }

    revalidateGroups();
    return { name: to };
  } catch (error) {
    console.error("[admin] renaming skill group failed", error);
    return { error: "Couldn't rename the group. Try again." };
  }
}

/**
 * Removes a group. Skills that were listed under it stay, but move to
 * "No group".
 */
export async function deleteSkillGroup(input: string): Promise<GroupResult> {
  await requireAdmin();

  const name = clean(input);
  if (!name) return { error: "Invalid group." };

  try {
    await connectDb();
    const moved = await Skill.updateMany({ group: sameName(name) } as never, {
      $set: { group: "" },
    });
    await SkillGroup.deleteOne({ key: name.toLowerCase() });

    revalidateGroups();
    return { name, ungrouped: moved.modifiedCount };
  } catch (error) {
    console.error("[admin] deleting skill group failed", error);
    return { error: "Couldn't remove the group. Try again." };
  }
}
