import { it, expect } from "vitest";
import { pathAlgorithms } from "./registry";
import { makeGrid } from "./gridUtils";

it.each(pathAlgorithms.map((a) => [a.name, a] as const))(
  "%s: every step has a valid pseudocode line",
  (_name, algo) => {
    const grid = makeGrid(5, 8, { row: 2, col: 1 }, { row: 2, col: 6 });
    for (const step of algo.run(grid)) {
      expect(step.line).toBeDefined();
      expect(step.line).toBeGreaterThanOrEqual(0);
      expect(step.line).toBeLessThan(algo.pseudocode.length);
    }
  },
);