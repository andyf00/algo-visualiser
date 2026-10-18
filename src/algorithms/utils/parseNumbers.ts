export const MAX_VALUE = 999;
export const MAX_LENGTH = 100;

export function parseNumbers(text: string): number[] | null {
  const isValid = /^[0-9,\s]+$/.test(text);
  if (!isValid) return null;

  const parsed = text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);

  if (parsed.length === 0 || parsed.length > MAX_LENGTH) return null;
  if (parsed.some((n) => n < 1 || n > MAX_VALUE)) return null;

  return parsed;
}
