import { useMemo } from "react";
import { makeGrid, emptyStates } from "./algorithms/pathfinding/gridUtils";
import { applyPathStep } from "./algorithms/pathfinding/types";
import { usePlayback } from "./hooks/usePlayback";
import { bfs } from "./algorithms/pathfinding/bfs";
import { GridView } from "./components/GridView";
import { Field } from "./components/Field";

export default function PathfindingDemo() {
  const grid = useMemo(() => {
    const g = makeGrid(15, 30, { row: 7, col: 3 }, { row: 7, col: 26 });
    for (let r = 3; r < 12; r++) g.walls[r][15] = true; // a vertical wall to go around
    return g;
  }, []);

  const steps = useMemo(() => bfs(grid), [grid]);
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

  return (
    <div>
      <GridView grid={grid} states={states}></GridView>

      <div className="button-row">
        <button className="primary" onClick={isPlaying ? pause : play}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={reset}>Reset</button>
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
