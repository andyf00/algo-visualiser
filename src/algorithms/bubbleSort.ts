import type { Step } from './types';

export function bubbleSort(input: number[]): Step[] {
  const a = [...input]; // never mutate the input
  const steps: Step[] = [];

  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      steps.push({ type: 'compare', indices: [j, j + 1] });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: 'swap', indices: [j, j + 1] });
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted, stop early
  }
  return steps;
}