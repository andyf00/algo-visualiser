import { describe, it, expect } from "vitest";
import { dijkstra } from "./dijkstra";
import { bfs } from "./bfs";
import { makeGrid, setWall, setWeight } from "./gridUtils";
import type { Cell, Grid, PathStep } from "./types";

const cell = (row: number, col: number): Cell => ({ row, col });

const pathCells = (steps: PathStep[]) =>
  steps.filter((s) => s.type === "path").map((s) => s.cell);

const isAdjacent = (a: Cell, b: Cell) =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;

// cost of a path = sum of weights of every cell entered (start is free)
const pathCost = (grid: Grid, path: Cell[]) =>
  path.slice(1).reduce((sum, c) => sum + grid.weights[c.row][c.col], 0);

// helpers that build grids using your own tested functions
const withWalls = (grid: Grid, walls: Cell[]) =>
  walls.reduce((g, c) => setWall(g, c, true), grid);

const withWeights = (grid: Grid, weights: [Cell, number][]) =>
  weights.reduce((g, [c, w]) => setWeight(g, c, w), grid);

describe("dijkstra", () => {
  it("finds a shortest path on an empty grid", () => {
    const grid = makeGrid(3, 3, cell(0, 0), cell(2, 2));
    const path = pathCells(dijkstra(grid));
    expect(path).toHaveLength(5);
    expect(path[0]).toEqual(cell(0, 0));
    expect(path[path.length - 1]).toEqual(cell(2, 2));
  });

  it("matches BFS path length when all weights are 1", () => {
    const grid = withWalls(makeGrid(6, 8, cell(0, 0), cell(5, 7)), [
      cell(1, 1), cell(1, 2), cell(2, 4), cell(3, 4), cell(4, 2), cell(3, 6),
    ]);
    expect(pathCells(dijkstra(grid))).toHaveLength(pathCells(bfs(grid)).length);
  });

  it("avoids a heavy cell when a cheap detour exists", () => {
    // 3x3, start middle-left, end middle-right. Centre is heavy.
    const grid = withWeights(makeGrid(3, 3, cell(1, 0), cell(1, 2)), [
      [cell(1, 1), 50],
    ]);
    const path = pathCells(dijkstra(grid));
    expect(path).not.toContainEqual(cell(1, 1));
    expect(pathCost(grid, path)).toBe(4); // detour: 4 cells entered at cost 1
  });

  it("goes through a heavy cell when there is no alternative", () => {
    // 1 row: the only route crosses the heavy cell
    const grid = withWeights(makeGrid(1, 3, cell(0, 0), cell(0, 2)), [
      [cell(0, 1), 9],
    ]);
    const path = pathCells(dijkstra(grid));
    expect(path).toEqual([cell(0, 0), cell(0, 1), cell(0, 2)]);
    expect(pathCost(grid, path)).toBe(10);
  });

  it("prefers a longer path if it is cheaper overall", () => {
    // Short route has one cell costing 20; long route is all 1s
    const grid = withWeights(makeGrid(3, 4, cell(0, 0), cell(0, 3)), [
      [cell(0, 1), 20],
    ]);
    const path = pathCells(dijkstra(grid));
    expect(path.length).toBeGreaterThan(4); // longer than the direct 4 cells
    expect(pathCost(grid, path)).toBeLessThan(20);
  });

  it("emits no path when the end is walled off", () => {
    const grid = withWalls(makeGrid(3, 3, cell(0, 0), cell(2, 2)), [
      cell(1, 2), cell(2, 1),
    ]);
    expect(pathCells(dijkstra(grid))).toHaveLength(0);
  });

  it("handles start equal to end", () => {
    const grid = makeGrid(2, 2, cell(0, 0), cell(0, 0));
    expect(pathCells(dijkstra(grid))).toEqual([cell(0, 0)]);
  });

  it("path cells are consecutive neighbours and never walls", () => {
    const grid = withWalls(
      withWeights(makeGrid(5, 5, cell(0, 0), cell(4, 4)), [[cell(2, 1), 7]]),
      [cell(1, 1), cell(3, 3)],
    );
    const path = pathCells(dijkstra(grid));
    for (let i = 1; i < path.length; i++) {
      expect(isAdjacent(path[i - 1], path[i])).toBe(true);
    }
    for (const c of path) expect(grid.walls[c.row][c.col]).toBe(false);
  });

  it("never discovers the same cell twice", () => {
    const grid = withWeights(makeGrid(6, 6, cell(0, 0), cell(5, 5)), [
      [cell(2, 2), 5], [cell(3, 3), 8],
    ]);
    const frontier = dijkstra(grid)
      .filter((s) => s.type === "frontier")
      .map((s) => `${s.cell.row},${s.cell.col}`);
    expect(new Set(frontier).size).toBe(frontier.length);
  });

  it("never visits the same cell twice", () => {
    const grid = withWeights(makeGrid(6, 6, cell(0, 0), cell(5, 5)), [
      [cell(1, 1), 9],
    ]);
    const visited = dijkstra(grid)
      .filter((s) => s.type === "visit")
      .map((s) => `${s.cell.row},${s.cell.col}`);
    expect(new Set(visited).size).toBe(visited.length);
  });

  it("only emits in-bounds, non-wall cells", () => {
    const grid = withWalls(makeGrid(4, 5, cell(0, 0), cell(3, 4)), [
      cell(1, 1), cell(2, 3),
    ]);
    for (const step of dijkstra(grid)) {
      const { row, col } = step.cell;
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(grid.rows);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(grid.cols);
      expect(grid.walls[row][col]).toBe(false);
    }
  });

  it("does not mutate the grid", () => {
    const grid = withWeights(makeGrid(3, 3, cell(0, 0), cell(2, 2)), [
      [cell(1, 1), 5],
    ]);
    const before = JSON.stringify(grid);
    dijkstra(grid);
    expect(JSON.stringify(grid)).toBe(before);
  });
});