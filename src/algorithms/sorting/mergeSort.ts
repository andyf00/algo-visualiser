import type { Step } from "../types";

export function mergeSort(input: number[]): Step[] {
  const a = [...input];
  const steps: Step[] = [];

  function sort(low: number, high: number) {
    if (high - low < 2) return;
    const mid = Math.floor((low + high) / 2);
    sort(low, mid);
    sort(mid, high);
    merge(low, mid, high);
  }

  function merge(low: number, mid: number, high: number) {
    const left = a.slice(low, mid);
    const right = a.slice(mid, high);
    const merged: number[] = [];

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      steps.push({ type: "compare", indices: [low + i, mid + j], line: 4 });
      merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
    }

    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    merged.forEach((value, offset) => {
      a[low + offset] = value;
      steps.push({ type: "overwrite", index: low + offset, value, line: 5 });
    });
  }

  sort(0, a.length);
  return steps;
}
