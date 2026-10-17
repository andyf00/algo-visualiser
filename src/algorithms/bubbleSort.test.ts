import { describe, it, expect } from "vitest";
import { bubbleSort } from "./bubbleSort";
import { cases, runSteps } from "./testUtils";

describe("bubbleSort", () => {

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
