import { connectDb } from "@/lib/db";
import { ACCEPTED_IMAGE_TYPES, IMAGE_URL_PREFIX } from "@/lib/image-config";
import { isObjectId } from "@/lib/ids";
import { StoredImage } from "@/models/stored-image";

type ImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

/**
 * Identifies an image by its first bytes rather than trusting the file name or
 * the browser-supplied type, so a renamed file can't be stored as an image.
 */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  const startsWith = (...signature: number[]) =>
    signature.every((byte, index) => bytes[index] === byte);

  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (startsWith(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (startsWith(0x47, 0x49, 0x46, 0x38) && (bytes[4] === 0x37 || bytes[4] === 0x39)) {
    return "image/gif";
  }
  // WebP: "RIFF" <size> "WEBP"
  if (startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "image/webp";
  }
  return null;
}

/** The stored-image id behind a `/api/images/<id>` URL, or null for any other URL. */
export function imageIdFromUrl(url: unknown) {
  if (typeof url !== "string" || !url.startsWith(IMAGE_URL_PREFIX)) return null;
  const id = url.slice(IMAGE_URL_PREFIX.length);
  return isObjectId(id) ? id : null;
}

/** Marks the uploads used by a just-saved entry as permanent. */
export async function confirmImages(urls: unknown[]) {
  const ids = urls.map(imageIdFromUrl).filter((id): id is string => id !== null);
  if (ids.length === 0) return;
  await connectDb();
  await StoredImage.updateMany({ _id: { $in: ids } }, { $set: { pending: false } });
}

/** Deletes uploaded images that no entry uses any more. Other URLs are ignored. */
export async function deleteImages(urls: unknown[]) {
  const ids = urls.map(imageIdFromUrl).filter((id): id is string => id !== null);
  if (ids.length === 0) return;
  await connectDb();
  await StoredImage.deleteMany({ _id: { $in: ids } });
}
