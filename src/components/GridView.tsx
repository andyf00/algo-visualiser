import type { Cell, CellState, Grid } from "../algorithms/pathfinding/types";

type Props = {
  grid: Grid;
  states: CellState[][];
  onCellDown: (cell: Cell) => void;
  onCellEnter: (cell: Cell) => void;
  onRelease: () => void;
};

export function GridView({
  grid,
  states,
  onCellDown,
  onCellEnter,
  onRelease,
}: Props) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
    >
      {states.map((row, r) =>
        row.map((state, c) => {
          const isStart = r === grid.start.row && c === grid.start.col;
          const isEnd = r === grid.end.row && c === grid.end.col;
          const isWall = grid.walls[r][c];
          const isHeavy = grid.weights[r][c] > 1;

          const cellType = isStart
            ? "start"
            : isEnd
              ? "end"
              : isWall
                ? "wall"
                : state;

          return (
            <div
              key={`${r}-${c}`}
              className={`cell ${cellType} ${isHeavy && !isWall ? "heavy" : ""}`}
              onMouseDown={() => onCellDown({ row: r, col: c })}
              onMouseEnter={() => onCellEnter({ row: r, col: c })}
            >
              {/* {isHeavy && !isWall ? grid.weights[r][c] : null} */}
            </div>
          );
        }),
      )}
    </div>
  );
}
