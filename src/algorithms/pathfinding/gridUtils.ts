import type { Cell, CellState, Grid } from "./types";

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
  return makeGrid(grid.rows, grid.cols, grid.start, grid.end)
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

export const sameCell = (a: Cell, b: Cell) =>
  a.row === b.row && a.col === b.col;

export const inBounds = (g: Grid, c: Cell) =>
  c.row >= 0 && c.row < g.rows && c.col >= 0 && c.col < g.cols;
