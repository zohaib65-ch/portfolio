// Creates an admin account, or resets the password if the email already exists.
// The password is stored only as a scrypt hash in MongoDB.
//
// Usage: npm run create-admin
//        npm run create-admin -- --email you@example.com
// For automation you can also pass --password, but that lands in shell
// history; the hidden prompt is preferred.
import { createInterface } from "node:readline";
import mongoose from "mongoose";
import { connectDb } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";
import { Admin } from "../src/models/admin";

const MIN_PASSWORD_LENGTH = 8;

function readFlag(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function ask(question: string) {
  return new Promise<string>((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function askHidden(question: string) {
  return new Promise<string>((resolve, reject) => {
    const { stdin, stdout } = process;
    if (!stdin.isTTY) {
      reject(
        new Error("Hidden input needs an interactive terminal. Pass --password instead.")
      );
      return;
    }

    stdout.write(question);
    let value = "";

    const finish = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.off("data", onData);
      stdout.write("\n");
    };
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          finish();
          resolve(value);
          return;
        }
        if (char === "\u0003") {
          finish();
          reject(new Error("Cancelled."));
          return;
        }
        if (char === "\u007f" || char === "\b") {
          value = value.slice(0, -1);
        } else {
          value += char;
        }
      }
    };

    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env or .env.local.");
  }

  const email = (readFlag("email") ?? (await ask("Admin email: ")))
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("That doesn't look like a valid email address.");
  }

  let password = readFlag("password");
  if (password === undefined) {
    password = await askHidden(`Password (min ${MIN_PASSWORD_LENGTH} characters): `);
    const confirmation = await askHidden("Confirm password: ");
    if (password !== confirmation) throw new Error("Passwords don't match.");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  await connectDb();
  await Admin.init(); // make sure the unique email index exists
  const passwordHash = await hashPassword(password);
  const existing = await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash },
    { upsert: true, returnDocument: "before" }
  );

  console.log(
    existing
      ? `Updated the password for ${email}.`
      : `Created admin ${email}. Sign in at /admin.`
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
