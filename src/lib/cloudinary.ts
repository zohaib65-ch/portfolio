import { createHash } from "node:crypto";

// Image storage. Uploads go to Cloudinary and MongoDB only keeps the resulting
// URL. Configure with the CLOUDINARY_URL from the Cloudinary dashboard:
//   cloudinary://<api_key>:<api_secret>@<cloud_name>

const API_BASE = process.env.CLOUDINARY_API_BASE ?? "https://api.cloudinary.com/v1_1";

/** Everything this admin uploads lives here, so nothing else is ever deleted. */
const FOLDER = "portfolio";

// Served with automatic format/quality (WebP/AVIF where supported) and capped
// at 1600px wide, so the stored URL is already the optimized one.
const DELIVERY_TRANSFORM = "f_auto,q_auto,c_limit,w_1600";

const REQUEST_TIMEOUT_MS = 20_000;

type Config = { cloudName: string; apiKey: string; apiSecret: string };

function getConfig(): Config | null {
  const raw = process.env.CLOUDINARY_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "cloudinary:" || !url.username || !url.password || !url.hostname) {
      return null;
    }
    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
    };
  } catch {
    return null;
  }
}

export function isCloudinaryConfigured() {
  return getConfig() !== null;
}

/**
 * Cloudinary's request signature: the signed parameters sorted by name and
 * joined as `name=value&…`, with the API secret appended, hashed with SHA-1.
 */
function sign(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

async function callApi(
  config: Config,
  action: "upload" | "destroy",
  params: Record<string, string>,
  file?: { bytes: Uint8Array<ArrayBuffer>; contentType: string }
) {
  const body = new FormData();
  for (const [key, value] of Object.entries(params)) body.set(key, value);
  body.set("api_key", config.apiKey);
  body.set("signature", sign(params, config.apiSecret));
  if (file) body.set("file", new Blob([file.bytes], { type: file.contentType }), "upload");

  const response = await fetch(`${API_BASE}/${config.cloudName}/image/${action}`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const json = (await response.json().catch(() => null)) as
    | { secure_url?: string; result?: string; error?: { message?: string } }
    | null;
  if (!response.ok || !json) {
    throw new Error(
      `Cloudinary ${action} failed (${response.status}): ${json?.error?.message ?? "no details"}`
    );
  }
  return json;
}

const timestamp = () => String(Math.floor(Date.now() / 1000));

/** Uploads an image and returns the URL to store and show on the site. */
export async function uploadToCloudinary(
  bytes: Uint8Array<ArrayBuffer>,
  contentType: string
) {
  const config = getConfig();
  if (!config) throw new Error("CLOUDINARY_URL is not set");

  const result = await callApi(
    config,
    "upload",
    { folder: FOLDER, timestamp: timestamp() },
    { bytes, contentType }
  );
  if (!result.secure_url) throw new Error("Cloudinary upload returned no URL");
  return result.secure_url.replace(
    "/image/upload/",
    `/image/upload/${DELIVERY_TRANSFORM}/`
  );
}

/**
 * The Cloudinary public id behind a URL this admin uploaded, or null for any
 * other URL (another site, a file in /public, someone else's Cloudinary).
 */
export function ownedPublicId(url: unknown) {
  const config = getConfig();
  if (!config || typeof url !== "string") return null;

  const prefix = `https://res.cloudinary.com/${config.cloudName}/image/upload/`;
  if (!url.startsWith(prefix)) return null;

  // <transformations>/v<version>/<public id>.<extension>
  const parts = url.slice(prefix.length).split("/");
  const version = parts.findIndex((part) => /^v\d+$/.test(part));
  if (version === -1) return null;
  const publicId = parts.slice(version + 1).join("/").replace(/\.[A-Za-z0-9]+$/, "");
  return publicId.startsWith(`${FOLDER}/`) ? publicId : null;
}

export async function destroyFromCloudinary(publicId: string) {
  const config = getConfig();
  if (!config) return;
  await callApi(config, "destroy", { public_id: publicId, timestamp: timestamp() });
}
