import { describe, it, expect } from "vitest";
import { applyPathStep } from "./types";
import { emptyStates } from "./gridUtils";
import type { PathStep } from "./types";

describe("applyPathStep", () => {
  it.each([
    ["frontier", "frontier"],
    ["visit", "visited"],
    ["path", "path"],
  ] as const)("a %s step sets the cell to %s", (type, expected) => {
    const states = emptyStates(3, 3);
    const step: PathStep = { type, cell: { row: 1, col: 2 } };
    const next = applyPathStep(states, step);
    expect(next[1][2]).toBe(expected);
  });

  it("does not mutate its input", () => {
    const states = emptyStates(3, 3);
    applyPathStep(states, { type: "visit", cell: { row: 0, col: 0 } });
    expect(states[0][0]).toBe("empty");
  });

  it("leaves every other cell alone", () => {
    const states = emptyStates(3, 3);
    const next = applyPathStep(states, {
      type: "visit",
      cell: { row: 1, col: 1 },
    });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (r === 1 && c === 1) continue;
        expect(next[r][c]).toBe("empty");
      }
    }
  });

  it("returns a new array and new rows", () => {
    const states = emptyStates(2, 2);
    const next = applyPathStep(states, {
      type: "visit",
      cell: { row: 0, col: 0 },
    });
    expect(next).not.toBe(states);
    expect(next[0]).not.toBe(states[0]);
  });
});
