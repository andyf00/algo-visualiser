import { useMemo, useState } from "react";
import { Bars } from "./components/Bars";
import { bubbleSort } from "./algorithms/bubbleSort";
import { applyStep } from "./algorithms/types";
import { usePlayback } from "./hooks/usePlayback";

const INPUT = [5, 3, 8, 1, 9, 2, 7];

export default function App() {
  const [speed, setSpeed] = useState(5);
  const delayMs = 1000 / speed ** 2;

  const steps = useMemo(() => bubbleSort(INPUT), []);

  const { stepIndex, isPlaying, play, pause, reset, stepForward, seek } =
    usePlayback(steps.length, delayMs);

  const array = useMemo(
    () => steps.slice(0, stepIndex).reduce(applyStep, INPUT),
    [steps, stepIndex],
  );

  const lastStep = stepIndex > 0 ? steps[stepIndex - 1] : null;

  let active: number[] = [];
  let activeType: "compare" | "swap" | "overwrite" | null = null;

  if (lastStep !== null) {
    activeType = lastStep.type;
    if (lastStep.type === "overwrite") {
      active = [lastStep.index];
    } else {
      active = lastStep.indices;
    }
  }

  return (
    <div>
      <Bars array={array} active={active} activeType={activeType} />
      <button onClick={isPlaying ? pause : play}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <button onClick={stepForward}>Step</button>
      <button onClick={reset}>Reset</button>
      <input
        type="range"
        min={1}
        max={10}
        value={speed}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      <input
        type="range"
        min={0}
        max={steps.length}
        value={stepIndex}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <p>
        Step {stepIndex} / {steps.length}
      </p>
    </div>
  );
}
