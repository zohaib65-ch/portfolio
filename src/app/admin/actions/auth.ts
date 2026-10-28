"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  clearFailedLogins,
  endSession,
  getAuthConfigProblems,
  getClientIp,
  isRateLimited,
  recordFailedLogin,
  startSession,
} from "@/lib/auth";

export type LoginState = { error?: string; email?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (getAuthConfigProblems().length > 0) {
    return { error: "Admin login isn't configured on the server.", email };
  }

  const ip = await getClientIp();
  let adminId: string | null = null;
  try {
    if (await isRateLimited(ip)) {
      return {
        error: "Too many failed attempts. Try again in 15 minutes.",
        email,
      };
    }

    adminId = await authenticate(email, password);
    if (!adminId) {
      await recordFailedLogin(ip);
      return { error: "Invalid email or password.", email };
    }

    await clearFailedLogins(ip);
  } catch (error) {
    console.error("[admin] login failed", error);
    return { error: "Couldn't reach the database. Try again shortly.", email };
  }

  if (!adminId) return { error: "Invalid email or password.", email };
  await startSession(adminId);
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}
