import type { Cell, CellState, Grid } from "./types";

export const directions = [
  { row: -1, col: 0 }, // up
  { row: 0, col: 1 }, // right
  { row: 1, col: 0 }, // down
  { row: 0, col: -1 }, // left
];

export function emptyStates(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, () =>
    Array<CellState>(cols).fill("empty"),
  );
}

export function makeGrid(
  rows: number,
  cols: number,
  start: Cell,
  end: Cell,
): Grid {
  return {
    rows,
    cols,
    walls: Array.from({ length: rows }, () => Array<boolean>(cols).fill(false)),
    weights: Array.from({ length: rows }, () => Array<number>(cols).fill(1)),
    start,
    end,
  };
}

// ---- Grid editing helpers ----
export function setWall(grid: Grid, cell: Cell, value: boolean): Grid {
  if (
    !inBounds(grid, cell) ||
    sameCell(cell, grid.start) ||
    sameCell(cell, grid.end) ||
    grid.walls[cell.row][cell.col] === value
  ) {
    return grid;
  }

  const newWalls = grid.walls.map((r) => [...r]);
  newWalls[cell.row][cell.col] = value;

  return { ...grid, walls: newWalls };
}

export function clearWalls(grid: Grid): Grid {
  if (!grid.walls.some((row) => row.some(Boolean))) return grid;
  return makeGrid(grid.rows, grid.cols, grid.start, grid.end);
}

export function moveEndpoint(
  grid: Grid,
  which: "start" | "end",
  cell: Cell,
): Grid {
  if (
    !inBounds(grid, cell) ||
    sameCell(cell, grid.start) ||
    sameCell(cell, grid.end)
  ) {
    return grid;
  }

  if (!grid.walls[cell.row][cell.col]) return { ...grid, [which]: cell };

  const newWalls = grid.walls.map((r) => [...r]);
  newWalls[cell.row][cell.col] = false;
  return { ...grid, [which]: cell, walls: newWalls };
}

export function setWeight(grid: Grid, cell: Cell, value: number): Grid {
  if (
    !inBounds(grid, cell) ||
    sameCell(cell, grid.start) ||
    sameCell(cell, grid.end) ||
    grid.walls[cell.row][cell.col] ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 99 ||
    grid.weights[cell.row][cell.col] === value
  ) {
    return grid;
  }

  const newWeights = grid.weights.map((r) => [...r]);
  newWeights[cell.row][cell.col] = value;

  return { ...grid, weights: newWeights };
}

export const sameCell = (a: Cell, b: Cell) =>
  a.row === b.row && a.col === b.col;

export const inBounds = (g: Grid, c: Cell) =>
  c.row >= 0 && c.row < g.rows && c.col >= 0 && c.col < g.cols;

export function buildPath(cameFrom: (Cell | null)[][], end: Cell): Cell[] {
  const path: Cell[] = [];
  let current: Cell | null = end;
  while (current !== null) {
    path.push(current);
    current = cameFrom[current.row][current.col];
  }
  path.reverse();

  return path;
}
