import { describe, it, expect } from "vitest";
import { insertionSort } from "./insertionSort";
import { cases, runSteps } from "./testUtils";

describe("insertionSort", () => {

  it.each(cases.map((c) => [c]))("sorts %j", (input) => {
    const result = runSteps(input, insertionSort(input));
    expect(result).toEqual([...input].sort((a, b) => a - b));
  });

  it("does not mutate the input", () => {
    const input = [3, 1, 2];
    insertionSort(input);
    expect(input).toEqual([3, 1, 2]);
  });
});
