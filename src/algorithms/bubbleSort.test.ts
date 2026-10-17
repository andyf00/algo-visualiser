import { describe, it, expect } from "vitest";
import { bubbleSort } from "./bubbleSort";
import { applyStep } from "./types";

function runSteps(input: number[], steps: ReturnType<typeof bubbleSort>) {
  return steps.reduce(applyStep, input);
}

describe("bubbleSort", () => {
  const cases: number[][] = [
    [],
    [1],
    [2, 1],
    [3, 1, 2],
    [5, 5, 1, 1],
    [1, 2, 3, 4],
    [9, 7, 5, 3, 1],
  ];

  it.each(cases.map((c) => [c]))("sorts %j", (input) => {
    const result = runSteps(input, bubbleSort(input));
    expect(result).toEqual([...input].sort((a, b) => a - b));
  });

  it("does not mutate the input", () => {
    const input = [3, 1, 2];
    bubbleSort(input);
    expect(input).toEqual([3, 1, 2]);
  });
});
