import { destroyFromCloudinary, ownedPublicId } from "@/lib/cloudinary";
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

/** Legacy: the id of an image stored in MongoDB, from a `/api/images/<id>` URL. */
function legacyImageId(url: unknown) {
  if (typeof url !== "string" || !url.startsWith(IMAGE_URL_PREFIX)) return null;
  const id = url.slice(IMAGE_URL_PREFIX.length);
  return isObjectId(id) ? id : null;
}

/**
 * Deletes images an entry no longer uses. Only images this admin uploaded are
 * touched (Cloudinary uploads in our folder, plus legacy MongoDB images); any
 * other URL, such as a brand icon or a file in /public, is left alone.
 */
export async function deleteImages(urls: unknown[]) {
  const legacyIds = urls.map(legacyImageId).filter((id): id is string => id !== null);
  if (legacyIds.length > 0) {
    await connectDb();
    await StoredImage.deleteMany({ _id: { $in: legacyIds } });
  }

  const publicIds = urls.map(ownedPublicId).filter((id): id is string => id !== null);
  const results = await Promise.allSettled(publicIds.map(destroyFromCloudinary));
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[images] couldn't delete from Cloudinary", result.reason);
    }
  }
}
