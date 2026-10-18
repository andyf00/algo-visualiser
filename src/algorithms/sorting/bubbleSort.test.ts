import { describe, it, expect } from "vitest";
import { bubbleSort } from "./bubbleSort";
import { cases, runSteps } from "../utils/testUtils";

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

  it("only compares/swaps adjacent, in-bounds indices", () => {
    const input = [5, 2, 4, 1, 3];
    for (const step of bubbleSort(input)) {
      if (step.type !== "overwrite") {
        const [x, y] = step.indices;
        expect(Math.abs(x - y)).toBe(1);
        expect(Math.min(x, y)).toBeGreaterThanOrEqual(0);
        expect(Math.max(x, y)).toBeLessThan(input.length);
      }
    }
  });
});
