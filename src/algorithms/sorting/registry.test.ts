import { it, expect } from "vitest";
import { algorithms } from "./registry";

it.each(algorithms.map((a) => [a.name, a] as const))(
  "%s: every step has a valid pseudocode line",
  (_name, algo) => {
    for (const step of algo.run([5, 2, 4, 1, 3, 9, 7])) {
      expect(step.line).toBeDefined();
      expect(step.line).toBeGreaterThanOrEqual(0);
      expect(step.line).toBeLessThan(algo.pseudocode.length);
    }
  },
);