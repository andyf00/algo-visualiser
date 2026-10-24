import { useMemo, useState } from "react";
import { applyPathStep, type Cell, type Grid } from "../algorithms/pathfinding/types";
import { usePlayback } from "../hooks/usePlayback";
import { GridView } from "../components/GridView";
import { Field } from "../components/Field";
import { StatTile } from "../components/StatTile";
import { Pill } from "../components/Pill";
import { Pseudocode } from "../components/Pseudocode";
import { pathAlgorithms } from "../algorithms/pathfinding/registry";
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
  clearWeights,
  defaultEndpoints,
} from "../algorithms/pathfinding/gridUtils";
import { Segmented, type Option } from "../components/Segmented";

const SIZES = {
  small: { rows: 10, cols: 15, label: "Small" },
  medium: { rows: 15, cols: 30, label: "Medium" },
  large: { rows: 25, cols: 50, label: "Large" },
} as const;
type SizeId = keyof typeof SIZES;

const SIZE_OPTIONS: Option<SizeId>[] = [
  { id: "small", label: SIZES.small.label },
  { id: "medium", label: SIZES.medium.label },
  { id: "large", label: SIZES.large.label },
]

type Tool = "wall" | "weight";

const TOOLS: Option<Tool>[] = [
  { id: "wall", label: "Wall" },
  { id: "weight", label: "Weight" },
]

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

const WEIGHT_VALUE = 5;

function newGrid(id: SizeId): Grid {
  const { rows, cols } = SIZES[id];
  const { start, end } = defaultEndpoints(rows, cols);
  return makeGrid(rows, cols, start, end);
}

export default function PathfindingView() {
  const [algoId, setAlgoId] = useState<AlgoId>("bfs");
  const [sizeId, setSizeId] = useState<SizeId>(() => (window.innerWidth < 600 ? "small" : "medium"));
  const [grid, setGrid] = useState(() => newGrid(sizeId));
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const [tool, setTool] = useState<Tool>("wall");
  const [speed, setSpeed] = useState(5);

  const pathAlgorithm = pathAlgorithms.find((a) => a.id === algoId)!;
  const steps = useMemo(() => algos[algoId](grid), [algoId, grid]);
  const delayMs = 1000 / speed ** 2;

  const { stepIndex, isPlaying, play, pause, reset, seek } = 
    usePlayback(steps.length, delayMs,);

  const visited = useMemo(
    () => steps.slice(0, stepIndex).filter((s) => s.type === "visit").length,
    [steps, stepIndex],
  );

  const pathCells = useMemo(
    () => steps.filter((s) => s.type === "path").map((s) => s.cell), 
    [steps],
  );

  const pathMoves = Math.max(0, pathCells.length - 1); // steps taken (does not count the start cell)
  const pathCost = pathCells.slice(1).reduce((sum, c) => sum + grid.weights[c.row][c.col], 0);
  const hasPath = steps.some((s) => s.type === "path");
  const isDone = steps.length > 0 && stepIndex === steps.length;
  const lastStep = stepIndex > 0 ? steps[stepIndex - 1] : null;
  const activeLine = isDone ? null : (lastStep?.line ?? null);

  const states = useMemo(
    () =>
      steps
        .slice(0, stepIndex)
        .reduce(applyPathStep, emptyStates(grid.rows, grid.cols)),
    [steps, stepIndex, grid],
  );

  const status = 
    steps.length === 0 ? "Nothing to search"
    : isDone ? (hasPath ? `Path found, cost ${pathCost}` : "No path found")
    : stepIndex === 0 ? "Press Play to begin"
    : "Searching...";

  function commit(next: Grid) {
    if (next !== grid) {
      setGrid(next);
      reset();
    }
  }

  function handleSizeChanges(id: SizeId) {
    if (id === sizeId) return;
    setSizeId(id);
    setGrid(newGrid(id));
    reset();
  }

  function applyMode(mode: DragMode, cell: Cell) {
    let next = grid;
    if (mode === "drawWall") next = setWall(grid, cell, true);
    else if (mode === "eraseWall") next = setWall(grid, cell, false);
    else if (mode === "drawWeight") next = setWeight(grid, cell, WEIGHT_VALUE);
    else if (mode === "eraseWeight") next = setWeight(grid, cell, 1);
    else if (mode === "moveStart") next = moveEndpoint(grid, "start", cell);
    else if (mode === "moveEnd") next = moveEndpoint(grid, "end", cell);

    commit(next);
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
    commit(clearWalls(grid));
  }

  function handleClearWeights() {
    commit(clearWeights(grid));
  }

  function handleAlgoChange(id: AlgoId) {
    setAlgoId(id);
    reset();
  }

  return (
    <div>
      <main>
        <div className="left">
          <section className="visualiser card">
            <GridView
              key={sizeId}
              grid={grid}
              states={states}
              onCellDown={handleDown}
              onCellEnter={handleEnter}
              onRelease={handleRelease}
            />
            <p className="explanation" aria-live="polite">{status}</p>

            <div className="legend">
              <span><i className="dot start"/>Start</span>
              <span><i className="dot end"/>End</span>
              <span><i className="dot wall"/>Wall</span>
              <span><i className="dot weight"/>Weighted</span>
              <span><i className="dot frontier"/>Frontier</span>
              <span><i className="dot visited"/>Visited</span>
              <span><i className="dot path"/>Path</span>
            </div>
          </section>

          <section className="info card">
            <div className="stat-row">
              <StatTile label="Visited" value={visited} />
              <StatTile label="Path Length" value={(isDone ? pathMoves : "-")} />
              <StatTile label="Path Cost" value={(isDone ? pathCost : "-")} />
            </div>

            <div className="pill-row">
              <Pill label="Time" value={pathAlgorithm.time} />
              <Pill label="Space" value={pathAlgorithm.space} />
              <Pill label="Weights" value={pathAlgorithm.usesWeights ? "used" : "ignored"} />
              <Pill label="Shortest" value={pathAlgorithm.usesWeights ? "lowest cost" : "fewest steps"} />
            </div>

            <p className="description">{pathAlgorithm.description}</p>
          </section>
        </div>

        <aside className="side">
          <section className="controls card">
            <select
              value={algoId}
              onChange={(e) => handleAlgoChange(e.target.value as AlgoId)}
            >
              <option value="bfs">BFS</option>
              <option value="dijkstra">Dijkstra</option>
              <option value="astar">A Star</option>
            </select>

            <div className="button-row">
              <button className="primary" onClick={isPlaying ? pause : play}>
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button onClick={reset}>Reset</button>
            </div>
            <div className="button-row">
              <button onClick={handleClearWalls}>Clear walls</button>
              <button onClick={handleClearWeights}>Clear weights</button>
            </div>

            <Field label="Speed" value={`${speed}x`}>
              <input
                type="range"
                min={1}
                max={10}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </Field>

            <Field label="Progress" value={`${stepIndex} / ${steps.length}`}>
              <input
                type="range"
                min={0}
                max={steps.length}
                value={stepIndex}
                onChange={(e) => seek(Number(e.target.value))}
              />
            </Field>

            <Field label="Draw Tool">
              <Segmented label="Draw Tool" value={tool} options={TOOLS} onChange={setTool}></Segmented>
            </Field>

            <Field label="Grid Size">
              <Segmented label="Grid Size" value={sizeId} options={SIZE_OPTIONS} onChange={handleSizeChanges}></Segmented>
            </Field>
          </section>

          <section className="card pseudocode-card">
            <h2 className="field-label">Pseudocode</h2>
            <Pseudocode lines={pathAlgorithm.pseudocode} activeLine={activeLine} />
          </section>
        </aside>
      </main>
    </div>
  );
}
