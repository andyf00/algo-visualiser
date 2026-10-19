import type { CellState, Grid } from "../algorithms/pathfinding/types";

type Props = { grid: Grid; states: CellState[][] };

export function GridView({ grid, states }: Props) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
    >
      {states.map((row, r) =>
        row.map((state, c) => {
          const isStart = r === grid.start.row && c === grid.start.col;
          const isEnd = r === grid.end.row && c === grid.end.col;
          const isWall = grid.walls[r][c];

          const cellType = isStart
            ? "start"
            : isEnd
              ? "end"
              : isWall
                ? "wall"
                : state;

          return <div key={`${r}-${c}`} className={`cell ${cellType}`} />;
        }),
      )}
    </div>
  );
}
