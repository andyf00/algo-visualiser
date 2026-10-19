import type { Step } from "./sorting/types";

export type Stats = { comparisons: number; swaps: number; writes: number };

export function computeStats(steps: Step[], stepIndex: number): Stats {
  const stats: Stats = { comparisons: 0, swaps: 0, writes: 0 };

  for (let i = 0; i < Math.min(stepIndex, steps.length); i++) {
    switch (steps[i].type) {
      case "compare":
        stats.comparisons++;
        break;
      case "swap":
        stats.swaps++;
        break;
      case "overwrite":
        stats.writes++;
        break;
    }
  }
  return stats;
}
