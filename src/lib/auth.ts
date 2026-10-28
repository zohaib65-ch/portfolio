import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db";
import { isObjectId } from "@/lib/ids";
import { DUMMY_HASH, verifyPassword } from "@/lib/password";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  readSession,
  signSession,
} from "@/lib/session";
import { Admin } from "@/models/admin";
import { LOGIN_WINDOW_SECONDS, LoginAttempt } from "@/models/login-attempt";

const MAX_FAILED_ATTEMPTS_PER_IP = 5;
// Backstop for when the client IP can't be trusted: x-forwarded-for is only
// reliable behind a proxy that overwrites it (e.g. Vercel). Without one, an
// attacker can rotate it to dodge the per-IP limit, so cap total failures too.
const MAX_FAILED_ATTEMPTS_TOTAL = 50;
const MIN_SECRET_LENGTH = 32;

/** Returns what's wrong with the environment, or an empty list when ready. */
export function getAuthConfigProblems() {
  const problems: string[] = [];
  if (!process.env.MONGODB_URI) problems.push("MONGODB_URI is not set.");
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    problems.push("AUTH_SECRET is not set.");
  } else if (secret.length < MIN_SECRET_LENGTH) {
    problems.push(`AUTH_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`);
  }
  return problems;
}

/** Checks credentials against the admins collection. Returns the admin id. */
export async function authenticate(email: string, password: string) {
  await connectDb();
  const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
  // Always run a verification so an unknown email can't be told apart by timing.
  const valid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_HASH);
  return admin && valid ? String(admin._id) : null;
}

export async function getClientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function isRateLimited(ip: string) {
  await connectDb();
  const since = new Date(Date.now() - LOGIN_WINDOW_SECONDS * 1000);
  const [fromIp, total] = await Promise.all([
    LoginAttempt.countDocuments({ ip, createdAt: { $gte: since } }),
    LoginAttempt.countDocuments({ createdAt: { $gte: since } }),
  ]);
  return (
    fromIp >= MAX_FAILED_ATTEMPTS_PER_IP || total >= MAX_FAILED_ATTEMPTS_TOTAL
  );
}

export async function recordFailedLogin(ip: string) {
  await connectDb();
  await LoginAttempt.create({ ip });
}

export async function clearFailedLogins(ip: string) {
  await connectDb();
  await LoginAttempt.deleteMany({ ip });
}

export async function startSession(adminId: string) {
  const token = await signSession(adminId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 0,
  });
}

export const isAuthenticated = cache(async () => {
  const jar = await cookies();
  const adminId = await readSession(jar.get(SESSION_COOKIE)?.value);
  if (!adminId || !isObjectId(adminId)) return false;

  // Also require the account to still exist, so deleting an admin in the
  // database signs them out rather than waiting for the cookie to expire.
  try {
    await connectDb();
    return Boolean(await Admin.exists({ _id: adminId }));
  } catch (error) {
    console.error("[admin] session check failed", error);
    return false;
  }
});

/**
 * Gate for admin pages and server actions. Layouts don't re-render on
 * client-side navigation and every exported server action is a public
 * endpoint, so call this at the top of each page and action rather than
 * relying on the layout or the proxy alone.
 */
export async function requireAdmin() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
}
