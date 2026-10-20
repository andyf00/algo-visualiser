import { useMemo, useState } from "react";
import {
  makeGrid,
  emptyStates,
  sameCell,
  setWall,
  moveEndpoint,
  clearWalls,
} from "./algorithms/pathfinding/gridUtils";
import { applyPathStep, type Cell } from "./algorithms/pathfinding/types";
import { usePlayback } from "./hooks/usePlayback";
import { bfs } from "./algorithms/pathfinding/bfs";
import { GridView } from "./components/GridView";
import { Field } from "./components/Field";

type DragMode = "none" | "drawWall" | "eraseWall" | "moveStart" | "moveEnd";

export default function PathfindingDemo() {
  const [grid, setGrid] = useState(() =>
    makeGrid(15, 30, { row: 7, col: 3 }, { row: 7, col: 26 }),
  );
  const steps = useMemo(() => bfs(grid), [grid]);

  const [dragMode, setDragMode] = useState<DragMode>("none");

  const { stepIndex, isPlaying, play, pause, reset, seek } = usePlayback(
    steps.length,
    30,
  );
  const states = useMemo(
    () =>
      steps
        .slice(0, stepIndex)
        .reduce(applyPathStep, emptyStates(grid.rows, grid.cols)),
    [steps, stepIndex, grid],
  );

  function applyMode(mode: DragMode, cell: Cell) {
    let next = grid;
    if (mode === "drawWall") next = setWall(grid, cell, true);
    else if (mode === "eraseWall") next = setWall(grid, cell, false);
    else if (mode === "moveStart") next = moveEndpoint(grid, "start", cell);
    else if (mode === "moveEnd") next = moveEndpoint(grid, "end", cell);

    if (next !== grid) {
      setGrid(next);
      reset();
    }
  }

  function handleDown(cell: Cell) {
    let mode: DragMode;
    if (sameCell(cell, grid.start)) mode = "moveStart";
    else if (sameCell(cell, grid.end)) mode = "moveEnd";
    else mode = grid.walls[cell.row][cell.col] ? "eraseWall" : "drawWall";

    setDragMode(mode);
    applyMode(mode, cell);
  }

  function handleEnter(cell: Cell) {
    applyMode(dragMode, cell);
  }

  function handleRelease() {
    setDragMode("none");
  }

  function handleClearWalls() {
    const next = clearWalls(grid);
    if (next !== grid) {
      setGrid(next)
      reset();
    }
  }

  return (
    <div>
      <GridView
        grid={grid}
        states={states}
        onCellDown={handleDown}
        onCellEnter={handleEnter}
        onRelease={handleRelease}
      ></GridView>

      <div className="button-row">
        <button className="primary" onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={reset}>Reset</button>
        <button onClick={handleClearWalls}>Clear walls</button>
      </div>

      <Field label="Progress" value={`${stepIndex} / ${steps.length}`}>
        <input
          type="range"
          min={0}
          max={steps.length}
          value={stepIndex}
          onChange={(e) => seek(Number(e.target.value))}
        />
      </Field>
    </div>
  );
}
