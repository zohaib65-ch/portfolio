// Shared by the upload action (server) and the image picker (client).

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export const IMAGE_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

/** Uploaded images are served from here. */
export const IMAGE_URL_PREFIX = "/api/images/";
