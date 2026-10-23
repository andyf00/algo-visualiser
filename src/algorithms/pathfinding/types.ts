type Meta = { line?: number };

export type Cell = { row: number; col: number };

export type Grid = {
  rows: number;
  cols: number;
  walls: boolean[][]; // walls[row][col] === true means blocked
  weights: number[][]; // cost of entering each cell; default 1
  start: Cell;
  end: Cell;
};

export type CellState = "empty" | "frontier" | "visited" | "path";

export type PathStep =
  | ({ type: "frontier"; cell: Cell } & Meta) // discovered, waiting to be explored
  | ({ type: "visit"; cell: Cell } & Meta) // now being explored
  | ({ type: "path"; cell: Cell } & Meta); // part of the final route

export function applyPathStep(
  states: CellState[][],
  step: PathStep,
): CellState[][] {
  const next = states.map((r) => [...r]);
  const { row, col } = step.cell;

  switch (step.type) {
    case "frontier":
      next[row][col] = "frontier";
      break;
    case "visit":
      next[row][col] = "visited";
      break;
    case "path":
      next[row][col] = "path";
      break;
  }
  return next;
}
