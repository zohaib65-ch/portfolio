import { SignJWT, jwtVerify } from "jose";

// Edge/proxy-safe: no next/headers, no Node-only APIs.

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const MIN_SECRET_LENGTH = 32;

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) return null;
  return new TextEncoder().encode(secret);
}

export async function signSession(adminId: string) {
  const key = getKey();
  if (!key) throw new Error("AUTH_SECRET is missing or too short");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

/** The admin id a valid token was issued to, or null. */
export async function readSession(token: string | undefined) {
  const key = getKey();
  if (!token || !key) return null;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload.role === "admin" && typeof payload.sub === "string"
      ? payload.sub
      : null;
  } catch {
    return null;
  }
}

export async function verifySession(token: string | undefined) {
  return (await readSession(token)) !== null;
}
