import type { Cell, Grid, PathStep } from "./types";
import { sameCell, inBounds, directions, buildPath } from "./gridUtils";

export function astar(grid: Grid): PathStep[] {
  const steps: PathStep[] = [];

  const dist = Array.from({ length: grid.rows }, () =>
    Array<number>(grid.cols).fill(Infinity),
  );
  const cameFrom = Array.from({ length: grid.rows }, () =>
    Array<Cell | null>(grid.cols).fill(null),
  );
  const done = Array.from({ length: grid.rows }, () =>
    Array<boolean>(grid.cols).fill(false),
  );
  const open: Cell[] = [grid.start];

  const heuristic = (c: Cell) =>
    Math.abs(c.row - grid.end.row) + Math.abs(c.col - grid.end.col);

  dist[grid.start.row][grid.start.col] = 0;

  while (open.length > 0) {
    let bestScore = Infinity;
    let best = 0;

    for (const [index, o] of open.entries()) {
      const score = dist[o.row][o.col] + heuristic(o);
      if (score < bestScore) {
        bestScore = score;
        best = index;
      }
    }
    const current = open.splice(best, 1)[0];

    done[current.row][current.col] = true;
    steps.push({ type: "visit", cell: current, line: 2 });

    if (sameCell(current, grid.end)) break;

    // neighbours
    for (const d of directions) {
      const next = { row: current.row + d.row, col: current.col + d.col };

      if (
        !inBounds(grid, next) ||
        grid.walls[next.row][next.col] ||
        done[next.row][next.col]
      ) {
        continue;
      }

      const cost =
        dist[current.row][current.col] + grid.weights[next.row][next.col];
      if (cost < dist[next.row][next.col]) {
        if (dist[next.row][next.col] === Infinity) {
          open.push(next);
          steps.push({ type: "frontier", cell: next, line: 5 });
        }
        dist[next.row][next.col] = cost;
        cameFrom[next.row][next.col] = current;
      }
    }
  }

  if (dist[grid.end.row][grid.end.col] === Infinity) return steps;

  const path = buildPath(cameFrom, grid.end);
  for (const p of path) steps.push({ type: "path", cell: p, line: 6 });
  return steps;
}
