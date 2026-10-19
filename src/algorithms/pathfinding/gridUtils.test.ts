import { describe, it, expect } from "vitest";
import { emptyStates, makeGrid } from "./gridUtils";
import { setWall } from "./gridUtils";

const g = makeGrid(3, 3, { row: 0, col: 0 }, { row: 2, col: 2 });

describe("gridUtils", () => {
  it("emptyStates has the right size and values", () => {
    const s = emptyStates(2, 3);
    expect(s).toHaveLength(2);
    expect(s[0]).toHaveLength(3);
    expect(s.flat().every((c) => c === "empty")).toBe(true);
  });

  it("makeGrid rows are independent arrays", () => {
    const g = makeGrid(3, 3, { row: 0, col: 0 }, { row: 2, col: 2 });
    g.walls[0][1] = true;
    expect(g.walls[1][1]).toBe(false);
    expect(g.walls[0][1]).toBe(true);
  });
});

describe("setWall", () => {
  it("sets a wall without mutating the old grid", () => {
    const next = setWall(g, { row: 1, col: 1 }, true);
    expect(next.walls[1][1]).toBe(true);
    expect(g.walls[1][1]).toBe(false);
    expect(next).not.toBe(g);
  });

  it.each([
    [{ row: 0, col: 0 }], // start
    [{ row: 2, col: 2 }], // end
    [{ row: -1, col: 0 }], // out of bounds
    [{ row: 0, col: 3 }], // out of bounds
  ])("ignores %j", (cell) => {
    expect(setWall(g, cell, true)).toBe(g);
  });

  it("returns the same grid when nothing changes", () => {
    expect(setWall(g, { row: 1, col: 1 }, false)).toBe(g);
  });
});
