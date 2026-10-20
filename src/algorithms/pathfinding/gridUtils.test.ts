import { describe, it, expect } from "vitest";
import {
  emptyStates,
  makeGrid,
  moveEndpoint,
  clearWalls,
  setWeight,
} from "./gridUtils";
import { setWall } from "./gridUtils";

const start = { row: 0, col: 0 };
const end = { row: 2, col: 2 };
const g = makeGrid(3, 3, start, end);

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

describe("moveEndpoint", () => {
  it.each([
    ["start", "end"],
    ["end", "start"],
  ] as const)("moving %s leaves %s alone", (which, other) => {
    const target = { row: 1, col: 1 };
    const next = moveEndpoint(g, which, target);

    expect(next[which]).toEqual(target);
    expect(next[other]).toEqual(g[other]);
  });

  it("doesn't mutate the old grid", () => {
    const next = moveEndpoint(g, "start", { row: 1, col: 1 });
    expect(g.start).toEqual({ row: 0, col: 0 });
    expect(next).not.toBe(g);
  });

  it("moving onto the other endpoint is ignored", () => {
    expect(moveEndpoint(g, "start", end)).toBe(g);
  });

  it.each([[{ row: -1, col: 0 }], [{ row: 0, col: 3 }], [start]] as const)(
    "moveEndpoint ignores %j",
    (cell) => {
      expect(moveEndpoint(g, "start", cell)).toBe(g);
    },
  );

  it("clears a wall when an endpoint moves onto it, without mutating the old grid", () => {
    const withWall = setWall(g, { row: 1, col: 1 }, true);
    expect(withWall.walls[1][1]).toBe(true);

    const next = moveEndpoint(withWall, "start", { row: 1, col: 1 });

    expect(next.start).toEqual({ row: 1, col: 1 });
    expect(next.walls[1][1]).toBe(false);
    expect(withWall.walls[1][1]).toBe(true);
  });

  it("moves onto an empty cell without copying walls", () => {
    const next = moveEndpoint(g, "end", { row: 1, col: 2 });
    expect(next.end).toEqual({ row: 1, col: 2 });
    expect(next.walls).toBe(g.walls); // same array, not just equal contents
  });
});

describe("clearWalls", () => {
  const start = { row: 0, col: 0 };
  const end = { row: 2, col: 2 };

  it("removes all walls and keeps size and endpoints", () => {
    let walled = setWall(g, { row: 1, col: 1 }, true);
    walled = setWall(walled, { row: 0, col: 2 }, true);

    const next = clearWalls(walled);

    expect(next.walls.flat().some(Boolean)).toBe(false);
    expect(next.rows).toBe(3);
    expect(next.cols).toBe(3);
    expect(next.start).toEqual(start);
    expect(next.end).toEqual(end);
  });

  it("does not mutate the old grid", () => {
    const walled = setWall(g, { row: 1, col: 1 }, true);
    clearWalls(walled);
    expect(walled.walls[1][1]).toBe(true);
  });

  it("returns the same grid when there are no walls", () => {
    const g = makeGrid(3, 3, start, end);
    expect(clearWalls(g)).toBe(g);
  });
});

describe("setWeight", () => {
  it("sets a weight without mutating the old grid", () => {
    const next = setWeight(g, { row: 1, col: 1 }, 9);
    expect(next.weights[1][1]).toBe(9);
    expect(g.weights[1][1]).toBe(1);
    expect(next).not.toBe(g);
  });

  it.each([
    [{ row: 0, col: 0 }], // start
    [{ row: 2, col: 2 }], // end
    [{ row: -1, col: 0 }], // out of bounds
    [{ row: 0, col: 3 }], // out of bounds
  ])("ignores invalid cell %j", (cell) => {
    expect(setWeight(g, cell, 9)).toBe(g);
  });

  it("returns the same grid when nothing changes", () => {
    expect(setWeight(g, { row: 1, col: 1 }, 1)).toBe(g);
  });

  it.each([0, -1, 1.5, 100, NaN, Infinity])(
    "ignores invalid weight %j",
    (n) => {
      expect(setWeight(g, { row: 1, col: 1 }, n)).toBe(g);
    },
  );

  it("ignores a wall cell", () => {
    const walled = setWall(g, { row: 1, col: 1 }, true);

    expect(setWeight(walled, { row: 1, col: 1 }, 9)).toBe(walled);
  });

  it("doesn't change walls when setting weight", () => {
    const walled = setWall(g, { row: 0, col: 2 }, true);
    const next = setWeight(walled, { row: 1, col: 1 }, 9);

    expect(next).not.toBe(walled);
    expect(next.weights[1][1]).toBe(9);
    expect(next.walls).toBe(walled.walls);
  });

  it("accepts the maximum weight", () => {
    const next = setWeight(g, { row: 1, col: 1 }, 99);
    expect(next.weights[1][1]).toBe(99);
  });

  it("rejects one above the maximum", () => {
    expect(setWeight(g, { row: 1, col: 1 }, 100)).toBe(g);
  });
});
