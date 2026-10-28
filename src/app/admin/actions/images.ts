"use server";

import { requireAdmin } from "@/lib/auth";
import {
  destroyFromCloudinary,
  isCloudinaryConfigured,
  ownedPublicId,
  uploadToCloudinary,
} from "@/lib/cloudinary";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/image-config";
import { detectImageType } from "@/lib/images";

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

  if (!isCloudinaryConfigured()) {
    return {
      error:
        "Image uploads aren't set up yet. Add CLOUDINARY_URL to .env (see .env.example) and restart the server.",
    };
  }

  try {
    return { url: await uploadToCloudinary(bytes, contentType) };
  } catch (error) {
    console.error("[admin] image upload failed", error);
    return { error: "Couldn't upload the image. Check the Cloudinary settings and try again." };
  }
}

/**
 * Deletes an image that was uploaded in the form but never saved (the user
 * picked another one, or removed it). Anything this admin didn't upload is
 * ignored.
 */
export async function discardImage(url: string): Promise<void> {
  await requireAdmin();

  const publicId = ownedPublicId(url);
  if (!publicId) return;
  try {
    await destroyFromCloudinary(publicId);
  } catch (error) {
    console.error("[admin] discarding image failed", error);
  }
}
