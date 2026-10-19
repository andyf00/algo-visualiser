import type { Step } from "./sorting/types";

// `array` is the array as currently displayed (after the step was applied)
export function describeStep(step: Step | null, array: number[]): string {
  if (step === null) return "Press Play or Step to begin.";
  if (step.note) return step.note;

  switch (step.type) {
    case "compare": {
      const [i, j] = step.indices;
      return `Comparing ${array[i]} and ${array[j]}`;
    }
    case "swap": {
      const [i, j] = step.indices;
      return `Swapped ${array[j]} and ${array[i]} (positions ${i} and ${j})`;
    }
    case "overwrite": {
      return `Wrote ${step.value} to position ${step.index}`;
    }
  }
}
