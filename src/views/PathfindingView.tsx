import { useMemo, useState } from "react";
import { applyPathStep, type Cell } from "../algorithms/pathfinding/types";
import { usePlayback } from "../hooks/usePlayback";
import { GridView } from "../components/GridView";
import { Field } from "../components/Field";
import { bfs } from "../algorithms/pathfinding/bfs";
import { dijkstra } from "../algorithms/pathfinding/dijkstra";
import { astar } from "../algorithms/pathfinding/astar";
import {
  makeGrid,
  emptyStates,
  sameCell,
  setWall,
  moveEndpoint,
  clearWalls,
  setWeight,
} from "../algorithms/pathfinding/gridUtils";

const algos = { bfs, dijkstra, astar };
type AlgoId = keyof typeof algos;
type DragMode =
  | "none"
  | "drawWall"
  | "eraseWall"
  | "drawWeight"
  | "eraseWeight"
  | "moveStart"
  | "moveEnd";
type Tool = "wall" | "weight";

const WEIGHT_VALUE = 5;

export default function PathfindingView() {
  const [grid, setGrid] = useState(() =>
    makeGrid(15, 30, { row: 7, col: 3 }, { row: 7, col: 26 }),
  );
  const [algoId, setAlgoId] = useState<AlgoId>("bfs");
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const [tool, setTool] = useState<Tool>("wall");

  const steps = useMemo(() => algos[algoId](grid), [algoId, grid]);

  const { stepIndex, isPlaying, play, pause, reset, seek } = usePlayback(
    steps.length,
    30,
  );

  const visited = useMemo(
    () => steps.slice(0, stepIndex).filter((s) => s.type === "visit").length,
    [steps, stepIndex],
  );

  const pathCost = useMemo(() => {
    const cells = steps.filter((s) => s.type === "path").map((s) => s.cell);
    return cells
      .slice(1)
      .reduce((sum, c) => sum + grid.weights[c.row][c.col], 0);
  }, [steps, grid]);

  const hasPath = steps.some((s) => s.type === "path");
  const isDone = steps.length > 0 && stepIndex === steps.length;

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
    else if (mode === "drawWeight") next = setWeight(grid, cell, WEIGHT_VALUE);
    else if (mode === "eraseWeight") next = setWeight(grid, cell, 1);
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
    else if (tool === "wall")
      mode = grid.walls[cell.row][cell.col] ? "eraseWall" : "drawWall";
    else
      mode =
        grid.weights[cell.row][cell.col] > 1 ? "eraseWeight" : "drawWeight";

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
      setGrid(next);
      reset();
    }
  }

  function handleAlgoChange(id: AlgoId) {
    setAlgoId(id);
    reset();
  }

  return (
    <div>
      <select
        value={algoId}
        onChange={(e) => handleAlgoChange(e.target.value as AlgoId)}
      >
        <option value="bfs">BFS</option>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A Star</option>
      </select>

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
        <button onClick={handleClearWalls}>Clear</button>
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

      <div>
        <button
          className={tool === "wall" ? "primary" : ""}
          onClick={() => setTool("wall")}
        >
          Wall
        </button>
        <button
          className={tool === "weight" ? "primary" : ""}
          onClick={() => setTool("weight")}
        >
          Weight
        </button>
      </div>

      <p>Visited: {visited}</p>
      {isDone &&
        (hasPath ? <p>Path cost: {pathCost}</p> : <p>No path found</p>)}
    </div>
  );
}
