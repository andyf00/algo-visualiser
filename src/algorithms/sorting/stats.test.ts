import { describe, it, expect } from "vitest";
import { computeStats } from "./stats";
import { bubbleSort } from "./bubbleSort";
import { mergeSort } from "./mergeSort";

describe("computeStats", () => {
  it("counts only up to stepIndex", () => {
    const steps = bubbleSort([3, 2, 1]);
    expect(computeStats(steps, 0)).toEqual({
      comparisons: 0,
      swaps: 0,
      writes: 0,
    });
    const all = computeStats(steps, steps.length);
    expect(all.comparisons + all.swaps + all.writes).toBe(steps.length);
  });

  it("never decreases as stepIndex grows", () => {
    const steps = bubbleSort([5, 1, 4, 2, 3]);
    let prev = computeStats(steps, 0);
    for (let i = 1; i <= steps.length; i++) {
      const cur = computeStats(steps, i);
      expect(cur.comparisons).toBeGreaterThanOrEqual(prev.comparisons);
      expect(cur.swaps).toBeGreaterThanOrEqual(prev.swaps);
      expect(cur.writes).toBeGreaterThanOrEqual(prev.writes);
      prev = cur;
    }
  });

  it("counts a partial range correctly", () => {
    // bubbleSort([2, 1]) is: compare [0,1], swap [0,1]
    const steps = bubbleSort([2, 1]);
    expect(computeStats(steps, 1)).toEqual({
      comparisons: 1,
      swaps: 0,
      writes: 0,
    });
    expect(computeStats(steps, 2)).toEqual({
      comparisons: 1,
      swaps: 1,
      writes: 0,
    });
  });

  it("reports writes for merge sort and no swaps", () => {
    const stats = computeStats(mergeSort([4, 3, 2, 1]), Infinity);
    expect(stats.swaps).toBe(0);
    expect(stats.writes).toBeGreaterThan(0);
  });
});
