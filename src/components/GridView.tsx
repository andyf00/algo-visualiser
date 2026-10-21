import type { Cell, CellState, Grid } from "../algorithms/pathfinding/types";

type Props = {
  grid: Grid;
  states: CellState[][];
  onCellDown: (cell: Cell) => void;
  onCellEnter: (cell: Cell) => void;
  onRelease: () => void;
};

function cellFromPoint(x: number, y: number): Cell | null {
  const el = document.elementFromPoint(x, y);
  if (!(el instanceof HTMLElement)) return null;
  const { row, col } = el.dataset;
  if (row === undefined || col === undefined) return null;
  return { row: Number(row), col: Number(col) };
}

export function GridView({
  grid,
  states,
  onCellDown,
  onCellEnter,
  onRelease,
}: Props) {
  function handleDown(e: React.PointerEvent) {
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) onCellDown(cell);
  }
  function handleMove(e: React.PointerEvent) {
    const cell = cellFromPoint(e.clientX, e.clientY);
    if (cell) onCellEnter(cell);
  }

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
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
              data-row={r}
              data-col={c}
            >
              {/* {isHeavy && !isWall ? grid.weights[r][c] : null} */}
            </div>
          );
        }),
      )}
    </div>
  );
}
