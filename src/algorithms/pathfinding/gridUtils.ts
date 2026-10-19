import type { Cell, CellState, Grid } from "./types";

export function emptyStates(rows: number, cols: number): CellState[][] {
  return Array.from({ length: rows }, () => Array<CellState>(cols).fill("empty"));
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
