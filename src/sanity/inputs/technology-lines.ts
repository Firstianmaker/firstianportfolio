export function newTechnologyLines(text: string, existing: readonly string[] = []): string[] {
  const seen = new Set(existing.map((item) => item.trim().toLowerCase()));
  return text.split(/\r\n|\n|\r/).map((item) => item.trim()).filter((item) => {
    const key = item.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
