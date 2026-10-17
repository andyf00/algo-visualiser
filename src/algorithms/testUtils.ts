import { applyStep } from "./types";
import type { Step } from "./types";

export const cases: number[][] = [
  [],
  [1],
  [2, 1],
  [3, 1, 2],
  [5, 5, 1, 1],
  [1, 2, 3, 4],
  [9, 7, 5, 3, 1],
];

export function runSteps(input: number[], steps: Step[]): number[] {
  return steps.reduce(applyStep, input);
}
