export type Step =
  | { type: "compare"; indices: [number, number]; note?: string; line?: number }
  | { type: "swap"; indices: [number, number]; note?: string; line?: number }
  | { type: "overwrite"; index: number; value: number; note?: string; line?: number };

export function applyStep(arr: number[], step: Step): number[] {
  const next = [...arr];
  if (step.type === "swap") {
    const [i, j] = step.indices;
    [next[i], next[j]] = [next[j], next[i]];
  } else if (step.type === "overwrite") {
    next[step.index] = step.value;
  }
  return next;
}
