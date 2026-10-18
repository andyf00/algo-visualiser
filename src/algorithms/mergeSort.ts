import type { Step } from "./types";

export function mergeSort(input: number[]): Step[] {
  const a = [...input];
  const steps: Step[] = [];

  function sort(left: number, right: number) {
    if (right - left < 2) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid, right);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number) {
    const leftArr = a.slice(left, mid);
    const rightArr = a.slice(mid, right);
    const merged: number[] = []

    let i = 0;
    let j = 0;

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ type: "compare", indices: [left + i, mid + j] });
      merged.push(leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++])
    }

    while (i < leftArr.length) merged.push(leftArr[i++])
    while (j < rightArr.length) merged.push(rightArr[j++])

    merged.forEach((value, offset) => {
      a[left + offset] = value
      steps.push({ type: "overwrite", index: left + offset, value });
    })
  }

  sort(0, a.length);
  return steps;
}
