import { describe, it, expect } from "vitest";
import { mergeSort } from "./mergeSort";
import { cases, runSteps } from "./testUtils";

describe("insertionSort", () => {
  it.each(cases.map((c) => [c]))("sorts %j", (input) => {
    const result = runSteps(input, mergeSort(input));
    expect(result).toEqual([...input].sort((a, b) => a - b));
  });

  it("does not mutate the input", () => {
    const input = [3, 1, 2];
    mergeSort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it("only touches in-bounds indices", () => {
    const input = [5, 2, 4, 1, 3, 9, 7];
    for (const step of mergeSort(input)) {
      const idx = step.type === "overwrite" ? [step.index] : step.indices;
      for (const n of idx) {
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThan(input.length);
      }
    }
  });
});
