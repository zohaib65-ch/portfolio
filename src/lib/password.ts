import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const COST = 16384; // N
const BLOCK_SIZE = 8; // r
const PARALLELISM = 1; // p
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

function derive(
  password: string,
  salt: Buffer,
  { N, r, p }: { N: number; r: number; p: number }
) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N, r, p }, (error, key) =>
      error ? reject(error) : resolve(key)
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(password, salt, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELISM,
  });
  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELISM,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, n, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;

  const expected = Buffer.from(hash, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Verified against when the email is unknown, so a missing account takes as
// long to reject as a wrong password.
export const DUMMY_HASH = [
  "scrypt",
  COST,
  BLOCK_SIZE,
  PARALLELISM,
  Buffer.alloc(SALT_LENGTH).toString("base64"),
  Buffer.alloc(KEY_LENGTH).toString("base64"),
].join("$");
