"use server";

import { requireAdmin } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import {
  ACCEPTED_IMAGE_TYPES,
  IMAGE_URL_PREFIX,
  MAX_IMAGE_BYTES,
} from "@/lib/image-config";
import { detectImageType } from "@/lib/images";
import { StoredImage } from "@/models/stored-image";

export type UploadResult = { url?: string; error?: string };

const TYPE_LABELS = ACCEPTED_IMAGE_TYPES.map((type) =>
  type.replace("image/", "").toUpperCase()
).join(", ");

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: `That image is too large. The limit is ${MAX_IMAGE_BYTES / 1024 / 1024} MB.` };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const contentType = detectImageType(bytes);
  if (!contentType) {
    return { error: `Unsupported file. Use ${TYPE_LABELS}.` };
  }

  try {
    await connectDb();
    const stored = await StoredImage.create({
      data: Buffer.from(bytes),
      contentType,
      size: bytes.length,
    });
    return { url: `${IMAGE_URL_PREFIX}${stored.id}` };
  } catch (error) {
    console.error("[admin] image upload failed", error);
    return { error: "Couldn't save the image. Check the database connection and try again." };
  }
}
