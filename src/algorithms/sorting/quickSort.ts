import type { Step } from "../types";

export function quickSort(input: number[]): Step[] {
  const a = [...input];
  const steps: Step[] = [];

  function sort(low: number, high: number) {
    if (low >= high) return;
    const pIndex = partition(low, high);
    sort(low, pIndex - 1);
    sort(pIndex + 1, high);
  }

  function partition(low: number, high: number): number {
    const pivot = a[high];

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ type: "compare", indices: [j, high], line: 2 });
      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ type: "swap", indices: [i, j], line: 3 });
        }
      }
    }

    if (i + 1 !== high) {
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      steps.push({ type: "swap", indices: [i + 1, high], line: 4 });
    }

    return i + 1;
  }

  sort(0, a.length - 1);
  return steps;
}
