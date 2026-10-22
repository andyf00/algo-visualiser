import { describe, it, expect } from "vitest";
import {
  emptyStates,
  makeGrid,
  moveEndpoint,
  clearWalls,
  clearWeights,
  setWeight,
  buildPath,
  emptyWalls,
  defaultWeights,
  inBounds,
  sameCell,
  defaultEndpoints,
} from "./gridUtils";
import { setWall } from "./gridUtils";
import type { Cell } from "./types";

const cell = (row: number, col: number): Cell => ({ row, col });
const start = cell(0, 0);
const end = cell(2, 2);
const g = makeGrid(3, 3, start, end);

describe("gridUtils", () => {
  it("emptyStates has the right size and values", () => {
    const s = emptyStates(2, 3);
    expect(s).toHaveLength(2);
    expect(s[0]).toHaveLength(3);
    expect(s.flat().every((c) => c === "empty")).toBe(true);
  });

  it("makeGrid rows are independent arrays", () => {
    const g = makeGrid(3, 3, cell(0, 0), cell(2, 2));
    g.walls[0][1] = true;
    expect(g.walls[1][1]).toBe(false);
    expect(g.walls[0][1]).toBe(true);
  });
});

describe("defaultEndpoints", () => {
  it.each([
    [10, 15],
    [15, 30],
    [25, 50],
  ])("endpoints for %ix%i are valid", (rows, cols) => {
    const { start, end } = defaultEndpoints(rows, cols);
    const grid = makeGrid(rows, cols, start, end);
    expect(inBounds(grid, start)).toBe(true);
    expect(inBounds(grid, end)).toBe(true);
    expect(sameCell(start, end)).toBe(false);
  });

  it("puts start left of end", () => {
    const { start, end } = defaultEndpoints(15, 30);
    expect(start.col).toBeLessThan(end.col);
  });
});

describe("setWall", () => {
  it("sets a wall without mutating the old grid", () => {
    const next = setWall(g, cell(1, 1), true);
    expect(next.walls[1][1]).toBe(true);
    expect(g.walls[1][1]).toBe(false);
    expect(next).not.toBe(g);
  });

  it.each([
    [cell(0, 0)], // start
    [cell(2, 2)], // end
    [cell(-1, 0)], // out of bounds
    [cell(0, 3)], // out of bounds
  ])("ignores %j", (cell) => {
    expect(setWall(g, cell, true)).toBe(g);
  });

  it("returns the same grid when nothing changes", () => {
    expect(setWall(g, cell(1, 1), false)).toBe(g);
  });
});

describe("moveEndpoint", () => {
  it.each([
    ["start", "end"],
    ["end", "start"],
  ] as const)("moving %s leaves %s alone", (which, other) => {
    const target = cell(1, 1);
    const next = moveEndpoint(g, which, target);

    expect(next[which]).toEqual(target);
    expect(next[other]).toEqual(g[other]);
  });

  it("doesn't mutate the old grid", () => {
    const next = moveEndpoint(g, "start", cell(1, 1));
    expect(g.start).toEqual(cell(0, 0));
    expect(next).not.toBe(g);
  });

  it("moving onto the other endpoint is ignored", () => {
    expect(moveEndpoint(g, "start", end)).toBe(g);
  });

  it.each([[cell(-1, 0)], [cell(0, 3)], [start]] as const)(
    "moveEndpoint ignores %j",
    (cell) => {
      expect(moveEndpoint(g, "start", cell)).toBe(g);
    },
  );

  it("clears a wall when an endpoint moves onto it, without mutating the old grid", () => {
    const withWall = setWall(g, cell(1, 1), true);
    expect(withWall.walls[1][1]).toBe(true);

    const next = moveEndpoint(withWall, "start", cell(1, 1));

    expect(next.start).toEqual(cell(1, 1));
    expect(next.walls[1][1]).toBe(false);
    expect(withWall.walls[1][1]).toBe(true);
  });

  it("moves onto an empty cell without copying walls", () => {
    const next = moveEndpoint(g, "end", cell(1, 2));
    expect(next.end).toEqual(cell(1, 2));
    expect(next.walls).toBe(g.walls); // same array, not just equal contents
  });
});

describe("clearWalls", () => {
  it("removes all walls and keeps size and endpoints", () => {
    const walled = setWall(setWall(g, cell(1, 1), true), cell(0, 2), true);
    const next = clearWalls(walled);
    expect(next.walls.flat().some(Boolean)).toBe(false);
    expect(next.rows).toBe(3);
    expect(next.cols).toBe(3);
    expect(next.start).toEqual(start);
    expect(next.end).toEqual(end);
  });

  it("leaves weights untouched", () => {
    const weighted = setWeight(setWall(g, cell(0, 2), true), cell(1, 1), 9);
    const next = clearWalls(weighted);
    expect(next.weights).toBe(weighted.weights);
    expect(next.weights[1][1]).toBe(9);
  });

  it("does not mutate the old grid", () => {
    const walled = setWall(g, cell(1, 1), true);
    clearWalls(walled);
    expect(walled.walls[1][1]).toBe(true);
  });

  it("returns the same grid when there are no walls", () => {
    const noWalls = makeGrid(3, 3, start, end);
    expect(clearWalls(noWalls)).toBe(noWalls);
  });

  it("regression: a weight-only grid is returned unchanged", () => {
    const weighted = setWeight(g, cell(1, 1), 9);
    expect(clearWalls(weighted)).toBe(weighted);
  });
});

describe("clearWeights", () => {
  it("resets weights and keeps size and endpoints", () => {
    const weighted = setWeight(setWeight(g, cell(1, 1), 9), cell(0, 2), 4);
    const next = clearWeights(weighted);
    expect(next.weights.flat().every((w) => w === 1)).toBe(true);
    expect(next.cols).toBe(3);
    expect(next.end).toEqual(end);
  });

  it("leaves walls untouched", () => {
    const weighted = setWeight(setWall(g, cell(0, 2), true), cell(1, 1), 9);
    const next = clearWeights(weighted);
    expect(next.walls).toBe(weighted.walls);
    expect(next.walls[0][2]).toBe(true);
  });

  it("does not mutate the old grid", () => {
    const weighted = setWeight(g, cell(1, 1), 9);
    clearWeights(weighted);
    expect(weighted.weights[1][1]).toBe(9);
  });

  it("returns the same grid when all weights are default", () => {
    expect(clearWeights(g)).toBe(g);
  });
});

describe("emptyWalls / defaultWeights", () => {
  it("have the right size and values", () => {
    const w = emptyWalls(2, 3);
    expect(w).toHaveLength(2);
    expect(w[0]).toHaveLength(3);
    expect(w.flat().every((v) => v === false)).toBe(true);

    const d = defaultWeights(2, 3);
    expect(d.flat().every((v) => v === 1)).toBe(true);
  });

  it("rows are independent arrays", () => {
    const w = emptyWalls(3, 3);
    w[0][1] = true;
    expect(w[1][1]).toBe(false);

    const d = defaultWeights(3, 3);
    d[0][1] = 9;
    expect(d[1][1]).toBe(1);
  });
});

describe("setWeight", () => {
  it("sets a weight without mutating the old grid", () => {
    const next = setWeight(g, cell(1, 1), 9);
    expect(next.weights[1][1]).toBe(9);
    expect(g.weights[1][1]).toBe(1);
    expect(next).not.toBe(g);
  });

  it.each([
    [cell(0, 0)], // start
    [cell(2, 2)], // end
    [cell(-1, 0)], // out of bounds
    [cell(0, 3)], // out of bounds
  ])("ignores invalid cell %j", (cell) => {
    expect(setWeight(g, cell, 9)).toBe(g);
  });

  it("returns the same grid when nothing changes", () => {
    expect(setWeight(g, cell(1, 1), 1)).toBe(g);
  });

  it.each([0, -1, 1.5, 100, NaN, Infinity])(
    "ignores invalid weight %j",
    (n) => {
      expect(setWeight(g, cell(1, 1), n)).toBe(g);
    },
  );

  it("ignores a wall cell", () => {
    const walled = setWall(g, cell(1, 1), true);

    expect(setWeight(walled, cell(1, 1), 9)).toBe(walled);
  });

  it("doesn't change walls when setting weight", () => {
    const walled = setWall(g, cell(0, 2), true);
    const next = setWeight(walled, cell(1, 1), 9);

    expect(next).not.toBe(walled);
    expect(next.weights[1][1]).toBe(9);
    expect(next.walls).toBe(walled.walls);
  });

  it("accepts the maximum weight", () => {
    const next = setWeight(g, cell(1, 1), 99);
    expect(next.weights[1][1]).toBe(99);
  });

  it("rejects one above the maximum", () => {
    expect(setWeight(g, cell(1, 1), 100)).toBe(g);
  });
});

describe("buildPath", () => {
  it("walks cameFrom back from the end and returns start-to-end order", () => {
    const cameFrom: (Cell | null)[][] = [
      [null, cell(0, 0), cell(0, 1), cell(0, 2)],
    ];
    expect(buildPath(cameFrom, cell(0, 3))).toEqual([
      cell(0, 0),
      cell(0, 1),
      cell(0, 2),
      cell(0, 3),
    ]);
  });

  it("returns just the start when end is the start", () => {
    const cameFrom: (Cell | null)[][] = [
      [null, cell(0, 0), cell(0, 1), cell(0, 2)],
    ];
    expect(buildPath(cameFrom, cell(0, 0))).toEqual([cell(0, 0)]);
  });

  it("follows cameFrom around a bend", () => {
    const cameFrom: (Cell | null)[][] = [
      [null, cell(0, 0)], // row 0: (0,0) is the start, (0,1) came from (0,0)
      [cell(0, 0), cell(0, 1)], // row 1: (1,0) came from (0,0), (1,1) came from (0,1)
    ];
    expect(buildPath(cameFrom, cell(1, 1))).toEqual([
      cell(0, 0),
      cell(0, 1),
      cell(1, 1),
    ]);
  });
});
