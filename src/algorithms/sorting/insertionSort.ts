import type { Step } from "../types";

export function insertionSort(input: number[]): Step[] {
  const a = [...input]; // never mutate the input
  const steps: Step[] = [];

  for (let i = 1; i < a.length; i++) {
    let j = i;

    while (j > 0) {
      steps.push({ type: "compare", indices: [j - 1, j] });
      if (a[j - 1] <= a[j]) break;

      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      steps.push({ type: "swap", indices: [j - 1, j] });
      j--;
    }
  }
  return steps;
}
