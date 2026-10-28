export function isObjectId(value: string) {
  return /^[0-9a-f]{24}$/i.test(value);
}
