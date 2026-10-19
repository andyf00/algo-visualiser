import { describe, it, expect } from "vitest";
import { bfs } from "./bfs";
import { makeGrid } from "./gridUtils";
import type { Cell, PathStep } from "./types";

const cell = (row: number, col: number): Cell => ({ row, col });

const pathCells = (steps: PathStep[]) =>
  steps.filter((s) => s.type === "path").map((s) => s.cell);

const isAdjacent = (a: Cell, b: Cell) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;

describe("bfs", () => {
  it("finds a shortest path on an empty 3x3 grid", () => {
    const grid = makeGrid(3, 3, cell(0, 0), cell(2, 2));
    const path = pathCells(bfs(grid));
    expect(path).toHaveLength(5); // 4 moves = 5 cells
    expect(path[0]).toEqual(cell(0, 0));
    expect(path[path.length - 1]).toEqual(cell(2, 2));
  });

  it("goes around a wall", () => {
    const grid = makeGrid(3, 3, cell(1, 0), cell(1, 2));
    grid.walls[1][1] = true; // blocks the direct route
    const path = pathCells(bfs(grid));
    expect(path).toHaveLength(5); // must detour via row 0 or row 2
    for (const c of path) expect(grid.walls[c.row][c.col]).toBe(false);
  });

  it("emits no path when the end is walled off", () => {
    const grid = makeGrid(3, 3, cell(0, 0), cell(2, 2));
    grid.walls[1][2] = true;
    grid.walls[2][1] = true;
    expect(pathCells(bfs(grid))).toHaveLength(0);
  });

  it("handles start next to end", () => {
    const grid = makeGrid(1, 2, cell(0, 0), cell(0, 1));
    expect(pathCells(bfs(grid))).toEqual([cell(0, 0), cell(0, 1)]);
  });

  it("handles start equal to end", () => {
    const grid = makeGrid(2, 2, cell(0, 0), cell(0, 0));
    expect(pathCells(bfs(grid))).toEqual([cell(0, 0)]);
  });

  it("path cells are consecutive neighbours", () => {
    const grid = makeGrid(5, 5, cell(0, 0), cell(4, 4));
    grid.walls[1][1] = true;
    grid.walls[2][2] = true;
    grid.walls[3][3] = true;
    const path = pathCells(bfs(grid));
    for (let i = 1; i < path.length; i++) {
      expect(isAdjacent(path[i - 1], path[i])).toBe(true);
    }
  });

  it("never discovers the same cell twice", () => {
    const grid = makeGrid(6, 6, cell(0, 0), cell(5, 5));
    const frontier = bfs(grid)
      .filter((s) => s.type === "frontier")
      .map((s) => `${s.cell.row},${s.cell.col}`);
    expect(new Set(frontier).size).toBe(frontier.length);
  });

  it("only emits in-bounds, non-wall cells", () => {
    const grid = makeGrid(4, 5, cell(0, 0), cell(3, 4));
    grid.walls[1][1] = true;
    grid.walls[2][3] = true;
    for (const step of bfs(grid)) {
      const { row, col } = step.cell;
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(grid.rows);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(grid.cols);
      expect(grid.walls[row][col]).toBe(false);
    }
  });

  it("does not mutate the grid", () => {
    const grid = makeGrid(3, 3, cell(0, 0), cell(2, 2));
    grid.walls[1][1] = true;
    const before = JSON.stringify(grid);
    bfs(grid);
    expect(JSON.stringify(grid)).toBe(before);
  });
});
