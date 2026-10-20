import type { Cell, Grid, PathStep } from "./types";
import { sameCell, inBounds, directions, buildPath } from "./gridUtils";

export function bfs(grid: Grid): PathStep[] {
  const steps: PathStep[] = [];

  const queue: Cell[] = [grid.start];
  let head = 0;

  // [][]
  const seen = Array.from({ length: grid.rows }, () =>
    Array<boolean>(grid.cols).fill(false),
  );
  const cameFrom = Array.from({ length: grid.rows }, () =>
    Array<Cell | null>(grid.cols).fill(null),
  );

  seen[grid.start.row][grid.start.col] = true;

  while (head < queue.length) {
    const current = queue[head++];
    steps.push({ type: "visit", cell: current });

    if (sameCell(current, grid.end)) break;

    // neighbours
    for (const d of directions) {
      const next = { row: current.row + d.row, col: current.col + d.col };

      if (
        !inBounds(grid, next) ||
        grid.walls[next.row][next.col] ||
        seen[next.row][next.col]
      ) {
        continue;
      }

      seen[next.row][next.col] = true;
      cameFrom[next.row][next.col] = current;
      queue.push(next);
      steps.push({ type: "frontier", cell: next });
    }
  }

  if (!seen[grid.end.row][grid.end.col]) return steps;

  const path = buildPath(cameFrom, grid.end);
  for (const p of path) steps.push({ type: "path", cell: p });
  return steps;
}
