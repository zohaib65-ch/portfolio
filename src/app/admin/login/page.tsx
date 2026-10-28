import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/login-form";
import { getAuthConfigProblems, isAuthenticated } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Admin } from "@/models/admin";

async function hasAdminAccount() {
  try {
    await connectDb();
    return Boolean(await Admin.exists({}));
  } catch {
    // Can't tell; show the form and let the login attempt report the error.
    return true;
  }
}

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const problems = getAuthConfigProblems();
  const needsAdmin = problems.length === 0 && !(await hasAdminAccount());

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center gap-6 px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to manage your portfolio content.
        </p>
      </div>

      {problems.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive">
            Admin isn&apos;t configured yet
          </p>
          <ul className="list-disc pl-4 text-destructive">
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
          <p className="text-muted-foreground">
            Copy <code>.env.example</code> to <code>.env.local</code>, fill in
            the values and restart the server.
          </p>
        </div>
      ) : needsAdmin ? (
        <div className="flex flex-col gap-2 rounded-md border p-4 text-sm">
          <p className="font-medium">No admin account yet</p>
          <p className="text-muted-foreground">
            Create one from the project folder with{" "}
            <code>npm run create-admin</code>, then come back and sign in.
          </p>
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  );
}
